# AI-Powered Smart Medication Dispensing and Monitoring System (MEDI-DISPENSE)
## Operational Workflow Document

---

> **Document Type:** System Operational Workflow Specification
> **System:** IoT Bedside Medication Dispenser + AI Analytics Backend
> **Stack:** ESP32 · Node.js · Express.js · MongoDB · React.js · node-cron
> **Audience:** Systems Engineers · Clinical Informaticists · Research Authors

---

## Introduction

This document describes the complete operational lifecycle of the MEDI-DISPENSE system — from hardware power-on through prescription creation, automated dispensing, event logging, and AI-driven clinical monitoring. Each workflow section maps to a discrete system phase and describes the actors involved, the sequence of operations, the data written or consumed, and the conditions that must be satisfied for the phase to complete successfully.

The system operates as a **closed-loop medication management pipeline**: a physical bedside IoT device dispenses tablets under the control of a backend scheduler, every event is logged immutably to a MongoDB database, and an analytics platform continuously processes the event stream to surface adherence metrics, anomaly signals, and patient risk scores to clinical staff.

---

## Workflow 1 — System Initialization

System initialization ensures all three tiers — IoT hardware, backend application server, and database — reach a known healthy state before any clinical operations begin.

### 1.1 IoT Device Startup

```
Power On
  └── ESP32 boots from flash (firmware v2.x)
        ├── Load device credentials from NVS encrypted partition
        │     { deviceCode, mqttUsername, mqttPassword, wardId, bedNumber }
        ├── Connect to hospital Wi-Fi (802.11 b/g/n)
        │     └── Retry every 5 seconds for up to 60 seconds
        │     └── If connection fails → display "NO NETWORK" on LCD, sound buzzer
        ├── Establish TLS connection to MQTT broker (port 8883)
        │     └── Subscribe to topic:  medi/{deviceId}/command
        │     └── Publish to topic:    medi/{deviceId}/status  (initial heartbeat)
        ├── REST GET /api/devices/{deviceId}/config
        │     └── Receive: { slotAssignments[], activeSchedule[], patientId }
        │     └── Cache configuration in device memory
        ├── Self-test sequence
        │     ├── Rotate stepper motor through full cycle → confirm return to home
        │     ├── Poll IR sensors on all active slots → log any blocked sensors
        │     └── Read weight cells → record baseline stock estimate per slot
        └── Set state machine to IDLE → display patient name on LCD
```

**Success condition:** Device receives MQTT connection acknowledgement, configuration payload is received, all self-tests pass.
**Failure condition:** Any step fails → device enters ERROR state, logs fault to EEPROM, alerts nurse via buzzer pattern.

---

### 1.2 Backend Server Startup

```
Node.js process starts (PM2 cluster mode)
  └── server.js bootstrap sequence:
        ├── Load environment variables (.env / process.env)
        │     { PORT, MONGO_URI, JWT_SECRET, MQTT_BROKER_URL, FCM_KEY }
        ├── Register Express middleware stack
        │     { helmet, cors, morgan, express.json, rateLimiter }
        ├── Mount all route modules
        │     /api/patients, /api/medications, /api/prescriptions,
        │     /api/slots, /api/dispense, /api/events,
        │     /api/analytics, /api/risk, /api/devices, /api/dashboard
        ├── Connect to MongoDB (see 1.3)
        ├── Connect MQTT client to broker
        │     └── Subscribe to:  medi/+/event
        │                        medi/+/status
        ├── Launch Scheduler Service (see Workflow 4)
        └── Server listening on configured PORT
```

---

### 1.3 Database Connection

```
Mongoose.connect(MONGO_URI)
  ├── Establish connection pool (default: 10 connections)
  ├── Register connection event listeners
  │     { connected, error, disconnected, reconnected }
  ├── Apply all Mongoose schemas and indexes
  │     └── createIndex() calls execute on first connection
  └── On success: emit "DB_CONNECTED" event → server continues startup
      On failure: log error → process.exit(1) → PM2 restarts process
```

**Readiness gate:** The HTTP server only begins accepting requests after both the database connection and MQTT connection are confirmed healthy. Premature requests receive `503 Service Unavailable`.

---

## Workflow 2 — Patient Registration

### 2.1 Clinical Staff Submits Patient Details

- A nurse or ward administrator accesses the React.js dashboard and completes the patient registration form.
- Required fields: full name, date of birth, gender, ward ID, bed number, device assignment, known allergies, and medical history.
- The form performs client-side validation before submission.

### 2.2 API Request Processing

```
POST /api/v1/patients
  ├── JWT middleware validates Bearer token and extracts role
  ├── Joi schema validates request body (all required fields present, types correct)
  ├── Controller calls patientService.createPatient(data)
  │     ├── Check: is the target deviceId already assigned to another patient?
  │     │     └── If conflict → throw ConflictError(409)
  │     ├── Check: does deviceId exist in the devices collection?
  │     │     └── If not found → throw NotFoundError(404)
  │     ├── Construct Patient document
  │     └── Patient.save() → MongoDB write
  └── Return 201 Created with { _id, name, deviceId, admittedAt }
```

### 2.3 Database Write

- A new document is inserted into the `patients` collection.
- `riskScore` is initialized to `0`, `riskLevel` to `LOW`.
- The assigned device's `patientId` field is updated to reference the new patient.
- Both writes are executed within a MongoDB session to ensure atomicity.

---

## Workflow 3 — Medication Management

### 3.1 Adding a Medication to the Formulary

```
POST /api/v1/medications
  ├── Validate: name + dosage + form are required
  ├── Check: does a medication with the same name and dosage already exist?
  │     └── If duplicate → return existing record (idempotent)
  ├── Insert document into medications collection
  └── Return 201 with { _id, name, dosage, form, yoloClass }
```

- The `yoloClass` field is set during this step — it maps the medication to a class label in the YOLOv8 visual identification model, enabling future AI-based tablet verification.

### 3.2 Linking Medications to Slots

- A medication must be **physically loaded** into a slot on the target device and **digitally registered** in the `slots` collection before it can be prescribed.

```
POST /api/v1/slots
  ├── Validate: deviceId, slotNumber (1–8), medicationId, initialStock
  ├── Check: is slotNumber already occupied on this device?
  │     └── If occupied → throw ConflictError(409)
  ├── Insert Slot document { deviceId, slotNumber, medicationId, currentStock, lowStockThreshold }
  └── Return 201 with slot document
```

- The slot record acts as the **inventory contract** between the physical cartridge and the digital system.

### 3.3 Medication Referenced in Prescription

- Once registered in the formulary and assigned to a slot, a medication is available for prescription creation (see Workflow 4).
- The `prescriptions.medicationId` field references `medications._id`, and `prescriptions` are indirectly linked to a slot through the patient's device assignment.

---

## Workflow 4 — Prescription Creation

### 4.1 Doctor Creates a Prescription

- The prescribing doctor accesses the dashboard, selects a patient, and completes the prescription form: medication, dose quantity, frequency, duration, and start date.
- Frequency is expressed in human-readable terms (e.g. "Three times daily") and the system converts this to a POSIX `cronExpression` (e.g. `0 8,14,20 * * *`).

### 4.2 Backend Validates and Stores the Prescription

```
POST /api/v1/prescriptions
  ├── Validate request body (patientId, medicationId, dosage, scheduleTime[], durationDays, startDate)
  ├── Check: is patientId a currently admitted patient?
  ├── Check: is the medication currently stocked in a slot on the patient's device?
  ├── Check: does the medication conflict with any of the patient's recorded allergies?
  │     └── If allergy conflict detected → throw ValidationError(400) with warning
  ├── Compute:
  │     cronExpression from scheduleTime[]
  │     endDate = startDate + durationDays
  ├── Insert Prescription document with active: true
  └── Return 201 with { prescriptionId, cronExpression, nextDispense, assignedSlot }
```

### 4.3 Scheduler Registration

- Immediately after the database write, `prescriptionService` calls `schedulerService.registerJob(prescriptionId)`.
- A `node-cron` job is created using the prescription's `cronExpression` and added to the in-memory `jobRegistry` map.
- The job fires the `dispenseService.triggerDispense()` function at every scheduled time.

```
jobRegistry.set("64f3a12b...rx01",
  cron.schedule("0 8,14,20 * * *", () => {
    dispenseService.triggerDispense(prescriptionId);
  }, { timezone: "Asia/Kuala_Lumpur" })
)
```

---

## Workflow 5 — Medication Scheduling

### 5.1 Cron Scheduler Monitors Prescription Times

- The `node-cron` engine fires the registered job at the exact scheduled minute.
- Before acting, the job performs a **pre-dispense validation sequence**:

```
Cron fires at scheduled time
  ├── Is the prescription still active?      [DB read: Prescription.findById]
  ├── Has the prescription end date passed?   [compare endDate vs Date.now()]
  ├── Is the slot currentStock > 0?          [DB read: Slot.findOne]
  └── Is there a dispense event for this
      slot within the last 5 minutes?        [duplicate guard: DispenseEvent.findOne]
      └── If any check fails → log SKIPPED event → notify nurse → abort
```

### 5.2 Backend Prepares the Dispense Command

- If all pre-checks pass, the Dispense Engine constructs the MQTT command payload:

```json
{
  "action": "DISPENSE",
  "prescriptionId": "64f3a12b...rx01",
  "slotId": "64f3a12b...sl04",
  "slotNumber": 4,
  "motorSteps": 200,
  "dosageQty": 1,
  "timeoutMs": 5000,
  "scheduledAt": "2025-03-07T08:00:00Z"
}
```

- The payload is published to the device's command topic: `medi/{deviceId}/command`.

---

## Workflow 6 — Tablet Dispensing

### 6.1 IoT Device Receives Command

```
ESP32 receives MQTT message on medi/{deviceId}/command
  ├── Parse JSON payload
  ├── Validate: action == "DISPENSE", slotNumber within range
  ├── Transition state machine: IDLE → VERIFYING
  ├── Display "Dispensing Slot 4..." on LCD
  └── Proceed to motor actuation
```

### 6.2 Device Rotates Motor and Releases Tablet

```
State: VERIFYING → DISPENSING
  ├── A4988 driver receives STEP/DIR pulses from ESP32 GPIO
  ├── NEMA-17 stepper rotates drum to position slot 4 above chute
  ├── SG90 servo opens cartridge gate
  ├── Motor executes motorSteps (200 steps = 1 tablet release)
  └── Gate closes after release

State: DISPENSING → CONFIRMING
  ├── Poll TCRT5000 IR sensor at chute exit
  ├── Wait for falling edge (beam broken by falling tablet) within timeoutMs
  │     └── Confirmed → irConfirmed = true
  │     └── Not confirmed within timeout → retry once
  │     └── Second failure → irConfirmed = false, status = FAILED
  └── Transition to IDLE
```

### 6.3 Device Publishes Confirmation Event

```json
{
  "prescriptionId": "64f3a12b...rx01",
  "slotNumber": 4,
  "status": "SUCCESS",
  "dispensedAt": "2025-03-07T08:00:02Z",
  "irConfirmed": true,
  "stockAfter": 17
}
```

- Published to: `medi/{deviceId}/event`

### 6.4 Slot Stock Updated

- Backend MQTT subscriber receives the confirmation event.
- `Slot.currentStock` is decremented by `dosageQty`.
- If `currentStock` falls below `lowStockThreshold`:
  - Push notification dispatched via FCM to nurse mobile app.
  - Alert document written to the `alerts` collection.
  - Dashboard flag activated for the affected device.

---

## Workflow 7 — Data Logging

### 7.1 Dispense Event Stored in Database

- The MQTT subscriber writes a `DispenseEvent` document immediately after receiving the device confirmation:

```json
{
  "_id": "64f3a12b...ev01",
  "patientId": "...ab01",
  "prescriptionId": "...rx01",
  "medicationId": "...me01",
  "slotId": "...sl04",
  "deviceId": "...dc09",
  "scheduledAt": "2025-03-07T08:00:00Z",
  "dispensedAt": "2025-03-07T08:00:02Z",
  "status": "SUCCESS",
  "dosageQty": 1,
  "stockAfter": 17,
  "irConfirmed": true,
  "triggeredBy": "scheduler"
}
```

- The write uses `{ ordered: false }` with a unique index on `{ prescriptionId, scheduledAt }` to prevent duplicate event creation from MQTT delivery retries.

### 7.2 Analytics Modules Update Metrics

- Upon each `DispenseEvent` write, the following downstream updates are triggered asynchronously:
  - **Adherence counter** for the patient is incremented or marked missed.
  - **Medication usage rate** for the slot's medication is updated.
  - **Stock depletion velocity** is recalculated for the affected slot.
  - **Nightly batch job** (scheduled at `01:00`) recomputes full adherence rates, risk scores, and dashboard snapshot aggregates for all active patients.

---

## Workflow 8 — Patient Adherence Monitoring

### 8.1 System Compares Prescribed vs Dispensed Medication

```
analyticsService.getAdherenceRate(patientId, windowDays)
  ├── Query: DispenseEvent.find({ patientId, scheduledAt: { $gte: windowStart } })
  ├── Count: total scheduled doses (from Prescription schedule × days)
  ├── Count: successful dispenses (status: SUCCESS)
  ├── Compute:
  │     adherenceRate = (successCount / scheduledCount) × 100
  │     trend = compare current 7-day rate vs prior 7-day rate
  └── Return: { adherenceRate, trend: IMPROVING | STABLE | DECLINING, scheduledCount, successCount }
```

### 8.2 Missed Dose Detection

- A dedicated cron job runs **every 30 minutes** to scan for overdue scheduled doses:

```
missedDoseDetector (runs: */30 * * * *)
  ├── Compute overdueThreshold = Date.now() - graceWindowMs (default: 60 minutes)
  ├── Query: Schedule.find({ scheduledAt: { $lte: overdueThreshold }, status: 'PENDING' })
  ├── For each overdue schedule:
  │     ├── Create DispenseEvent { status: 'MISSED', dispensedAt: null }
  │     ├── Update Schedule.status = 'MISSED'
  │     └── alertService.notifyMissedDose(patientId, medicationId, scheduledAt)
  └── Log: total missed doses detected in this scan cycle
```

- Missed dose events appear immediately in the dashboard alert feed and increment the patient's `missedDoseCount` metric used by the risk engine.

---

## Workflow 9 — Risk Detection

### 9.1 Risk Engine Computation

The Risk Detection Engine runs as a **nightly batch job** at `01:00` and also on-demand via `GET /api/risk/detect`. It evaluates four weighted factors per patient:

```
riskService.computeRiskScore(patientId)
  │
  ├── Factor 1 — Adherence (weight 0.35)
  │     adherenceFactor = (1 - adherenceRate/100) × 100 × 0.35
  │
  ├── Factor 2 — Missed Doses (weight 0.25)
  │     missedFactor = (missedCount / scheduledCount) × 100 × 0.25
  │
  ├── Factor 3 — Anomaly Detection (weight 0.25)
  │     Compute Z-score of patient's daily dose frequency vs 30-day baseline:
  │       zScore = |( currentFreq - historicalMean ) / historicalStdDev |
  │       anomalyFactor = min(zScore / 3.0, 1.0) × 100 × 0.25
  │
  ├── Factor 4 — Stock Depletion (weight 0.15)
  │     daysUntilEmpty = currentStock / depletionVelocityPerDay
  │     stockFactor = (1 - min(daysUntilEmpty / 7, 1.0)) × 100 × 0.15
  │
  └── compositeScore = sum of all four factors  [0 – 100]
```

### 9.2 Overdose Detection

- Before each dispense event, the engine checks whether dispensing this dose would exceed the maximum safe frequency for the medication within a rolling 24-hour window:

```
Check: count of SUCCESS events for this { patientId, medicationId }
       in the last 24 hours >= prescription.maxDailyDose
  └── If true → ABORT dispense, status = SKIPPED
              → Log overdose-risk event
              → Alert nurse: "Potential over-dispense detected"
```

### 9.3 Alert Generation

| Trigger Condition | Alert Type | Delivery Channel |
|---|---|---|
| `riskScore >= 71` | HIGH RISK patient | FCM push + dashboard banner |
| `missedCount >= 3 in 24h` | Missed dose alert | FCM push + SMS (optional) |
| `zScore > 3.0` | Anomaly detected | Dashboard flag + email |
| `currentStock <= lowStockThreshold` | Low stock warning | FCM push |
| `currentStock == 0` | Critical stock depletion | FCM push + buzzer on device |
| `Potential over-dispense detected` | Safety alert | FCM push + dispense blocked |
| Device offline > 5 minutes | Device connectivity alert | Dashboard flag |

---

## Workflow 10 — Dashboard Monitoring

### 10.1 Dashboard Queries Analytics APIs

- On load and on a configurable auto-refresh interval (default: 60 seconds), the React.js dashboard calls:

```
GET /api/dashboard/summary
  └── Reads pre-computed DashboardSnapshot document (updated nightly)
  └── Returns:
      { activePatients, devicesOnline, devicesOffline,
        todayScheduled, todayCompleted, todayMissed,
        fleetAdherenceRate, highRiskPatients, lowStockAlerts }

GET /api/analytics/adherence/:patientId?period=30d
  └── Per-patient adherence rate, trend, missed count

GET /api/analytics/usage?medicationId=...&period=7d
  └── Daily dispense series, depletion velocity, days until empty

GET /api/risk/detect?patientId=...
  └── Real-time risk score with factor breakdown

GET /api/devices/:id/status
  └── Device online status, last heartbeat, slot stock snapshot
```

### 10.2 Doctor / Nurse Reviews System State

- The dashboard presents information in three priority views:

  **Alert Feed (real-time):**
  - New missed doses, device offline events, low-stock warnings, and HIGH-risk patients surface immediately via WebSocket push from the backend.
  - Each alert has an Acknowledge button — acknowledgement writes a `{ acknowledgedBy, acknowledgedAt }` record to the alert document.

  **Patient Monitoring Panel:**
  - Table of all admitted patients sorted by `riskScore` descending.
  - Each row shows: name, ward/bed, today's dose status (complete / partial / missed), adherence rate, risk level badge, and last dispense time.

  **Fleet Device Panel:**
  - Grid of all registered devices with online/offline status.
  - Slot inventory bars showing stock percentage per slot.
  - Firmware version and last-seen timestamp per device.

### 10.3 Operational Decision Loop

```
Clinical Staff Reviews Dashboard
  │
  ├── HIGH RISK patient identified
  │     └── Doctor reviews adherence history → adjusts prescription if needed
  │               └── Prescription update → scheduler re-registers cron job
  │
  ├── Missed dose alert acknowledged
  │     └── Nurse visits bedside → manually administers dose if clinically indicated
  │               └── Nurse logs manual administration via dashboard override form
  │
  └── Low stock alert acknowledged
        └── Pharmacist refills cartridge slot
                  └── PATCH /api/slots/:id/stock { newStock }
                            └── Slot.currentStock updated, alert cleared
```

---

## Summary: End-to-End Lifecycle

```
Device Boot + Server Start + DB Connect
        │
        ▼
Patient Registered → Device Assigned
        │
        ▼
Medication Added to Formulary → Loaded into Slot
        │
        ▼
Doctor Creates Prescription → Cron Job Registered
        │
        ▼
Cron Fires → Pre-checks Pass → MQTT Command Sent to Device
        │
        ▼
ESP32 Rotates Motor → IR Sensor Confirms → ACK Published
        │
        ▼
DispenseEvent Written (Immutable) → Slot Stock Decremented
        │
        ▼
Analytics Updated → Adherence Rate Recalculated
        │
        ▼
Risk Engine Scores Patient → Alerts Generated if Threshold Crossed
        │
        ▼
Dashboard Surfaced to Clinical Staff → Intervention if Required
        │
        └── Loop continues for every scheduled dose
```

---

*Operational Workflow Document v1.0 — MEDI-DISPENSE*
*ESP32 · Node.js · Express.js · MongoDB · node-cron · React.js*
