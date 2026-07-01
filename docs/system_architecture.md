# AI-Powered Smart Medication Dispensing and Monitoring System (MEDI-DISPENSE)
### System Architecture Document — Technical Report

---

> **Document Type:** System Architecture Specification
> **Domain:** Healthcare IoT · AI · Embedded Systems
> **Stack:** ESP32 · Node.js · Express.js · MongoDB · React.js · Android
> **Version:** 1.0

---

## 1. Introduction

Medication non-adherence and dispensing errors represent two of the most prevalent and preventable sources of adverse patient outcomes in clinical environments. The World Health Organization estimates that medication errors affect approximately 1.3 million patients annually in the United States alone, imposing a combined clinical and economic burden that significantly exceeds that of many other preventable harm categories [1]. Manual dispensing workflows compound this problem by introducing timing inaccuracies, stock management gaps, and limited visibility into individual patient adherence patterns.

MEDI-DISPENSE is an IoT-enabled, AI-augmented bedside medication dispensing and monitoring platform designed to address these challenges at the point of care. The system pairs a physical smart dispensing device — built on an ESP32 microcontroller with a stepper-motor-driven tablet mechanism — with a cloud-connected Node.js/MongoDB backend that manages the full medication lifecycle: from prescription ingestion and automated scheduling through dispense actuation, event logging, adherence analytics, and AI-driven risk detection. A React.js web dashboard and Android companion application surface real-time system state to clinical staff and administrators.

This document describes the overall system architecture, component design, data flows, IoT-to-cloud communication model, and the engineering decisions governing scalability and security.

---

## 2. Overall System Architecture

MEDI-DISPENSE is organized as a five-tier distributed system. Each tier has a clearly bounded responsibility and communicates with adjacent tiers through well-defined interfaces.

```
┌──────────────────────────────────────────────────────────────────┐
│                     PRESENTATION TIER                            │
│        React.js Web Dashboard  |  Android WebView App           │
└─────────────────────────┬────────────────────────────────────────┘
                          │  HTTPS REST / WebSocket
┌─────────────────────────▼────────────────────────────────────────┐
│                     API GATEWAY TIER                             │
│          Node.js + Express.js  |  JWT Auth  |  Rate Limiting     │
└──────────┬──────────────────────────────────┬────────────────────┘
           │  Business Logic                  │  MQTT / REST
┌──────────▼─────────────┐        ┌───────────▼──────────────────┐
│   APPLICATION TIER     │        │      IoT DEVICE TIER         │
│  Scheduler · Analytics │        │  ESP32 · Stepper Motor       │
│  Risk Engine · Alerts  │        │  Medication Slots · Sensors  │
└──────────┬─────────────┘        └──────────────────────────────┘
           │  Mongoose ODM
┌──────────▼─────────────────────────────────────────────────────┐
│                       DATA TIER                                 │
│   MongoDB  |  Patients · Medications · Prescriptions           │
│            |  Slots · DispenseEvents · RiskScores              │
└────────────────────────────────────────────────────────────────┘
```

This tiered model ensures that concerns remain separated: the IoT device handles only physical actuation and local sensing; the application tier owns all business logic and intelligence; and the data tier provides a durable, queryable record of all system events.

---

## 3. Component Descriptions

### 3.1 IoT Smart Medication Dispenser Device

The bedside dispenser is built on the **ESP32-WROOM-32D** — a dual-core 240 MHz microcontroller with integrated 802.11 b/g/n Wi-Fi. The hardware assembly comprises:

| Component | Model / Specification | Role |
|---|---|---|
| Microcontroller | ESP32-WROOM-32D | Central controller, Wi-Fi, MQTT client |
| Dispensing actuator | NEMA-17 Stepper + A4988 driver | Rotates medication drum to selected slot |
| Gate servo | SG90 9g micro servo | Opens/closes per-slot dispensing gate |
| Pill confirmation | TCRT5000 IR sensor | Detects physical tablet release |
| Inventory sensing | HX711 + Load cell | Weight-based stock estimation per slot |
| Local display | 16×2 I2C LCD | Patient name, next dose, device status |
| Alert output | Active buzzer | Audible alert for errors or low stock |

The firmware implements a five-state machine: **IDLE → VERIFYING → DISPENSING → CONFIRMING → ERROR**. Each dispense cycle is triggered by an MQTT command from the backend scheduler. The device publishes a confirmation event (with IR sensor outcome and remaining stock count) to a device-specific MQTT topic upon cycle completion.

### 3.2 Backend Server

The backend is a **Node.js v20 LTS** application built on the **Express.js v4** framework. It exposes a versioned REST API (`/api/v1/`) organized into the following functional modules:

- **Patient Management** — CRUD operations for patient records, allergy flags, bed/ward assignments
- **Medication Management** — Formulary maintenance, stock thresholds, dosage metadata
- **Prescription Management** — Prescription creation, duration, frequency (POSIX cron expressions), allergy conflict checks
- **Slot Inventory Management** — Cartridge slot assignment, depletion tracking, refill workflows
- **Tablet Dispensing API** — Manual nurse-triggered dispense endpoint with duplicate-dose guard window
- **Medication Scheduler** — `node-cron` job registry, dynamically updated on prescription changes
- **Dispense Event Logger** — Immutable event writes with patient, device, medication, timestamp, and outcome
- **Medication Usage Analytics** — MongoDB aggregation pipelines for consumption rates and depletion velocity
- **Missed Dose Detection** — Periodic scan for PENDING schedules exceeding the configurable grace window
- **Risk Detection Engine** — Weighted multi-factor AI risk scoring (detailed in Section 3.5)
- **Dashboard Analytics** — Pre-aggregated KPI snapshots for sub-100 ms dashboard response
- **Device Monitoring** — MQTT heartbeat processing, online/offline fleet status

### 3.3 Database (MongoDB)

All system state is persisted in **MongoDB 7.0**. The primary collections and their relationships are:

```
patients ──(1:1)──▶ devices
    │
    └──(1:N)──▶ prescriptions ──(N:1)──▶ medications ──(1:1)──▶ slots
                      │
                      └──(1:N)──▶ schedules
                                       │
                                       └──(1:N)──▶ dispenseevents
                                                         │
                                                    analyticsSnapshots
                                                    riskScores
```

Critical indexes are placed on `{ patientId, scheduledAt }` (compound, for analytics queries) and `{ status, scheduledAt }` (for missed-dose detection scans). The `dispenseevents` collection exposes no DELETE endpoint — records are marked `voided` only through a soft-flag, preserving the full audit trail.

### 3.4 Web Dashboard (React.js)

The clinical dashboard is a **React.js** single-page application served via a CDN-backed static host. Key views include:

- **Patient Overview** — Active prescriptions, today's dose schedule, real-time dispense status
- **Device Fleet Monitor** — Online/offline status, stock levels, last heartbeat timestamp
- **Analytics View** — Adherence trend charts, usage heatmaps, cohort risk distribution
- **Alert Centre** — Chronological low-stock and missed-dose alerts with acknowledgement workflow

The dashboard communicates with the backend via REST for data fetches and WebSocket for real-time event streaming (dispense confirmations, device status changes).

### 3.5 Android Application

The Android application is a lightweight **WebView wrapper** that loads the React.js dashboard over HTTPS. This design eliminates the need for a separate mobile codebase while providing native-app distribution through the Google Play Store. Push notifications for critical alerts (missed doses, device offline, critically low stock) are delivered via **Firebase Cloud Messaging (FCM)**, with the backend triggering notification dispatch through the FCM HTTP v1 API.

### 3.6 AI Risk Detection Engine

The Risk Detection Engine synthesises outputs from four analytical sub-modules into a composite **patient risk score** on a continuous scale of 0–100:

```
Risk Score =  (adherenceFactor  × 0.35)
            + (missedDoseFactor × 0.25)
            + (anomalyFactor    × 0.25)
            + (stockFactor      × 0.15)
```

| Factor | Source Signal | Scoring Logic |
|---|---|---|
| Adherence | Dispense success rate (rolling 30 days) | `(1 - adherenceRate) × 100` |
| Missed Dose | Missed doses / total scheduled | Ratio × 100 |
| Anomaly | Z-score of dose frequency & timing deviation | `zScore > 2σ → WARNING; > 3σ → CRITICAL` |
| Stock Depletion | Days until slot empty at current velocity | Inverse urgency index |

Patients scoring above **70** are classified HIGH RISK and appear prioritised in the dashboard alert feed. The engine re-computes scores nightly via a scheduled batch job and stores results in the `riskScores` collection for trend visualisation.

---

## 4. Data Flow in the System

The end-to-end lifecycle of a single medication dispense event proceeds through the following stages:

```
1. PRESCRIPTION CREATION
   Doctor → POST /api/prescriptions
   → Prescription stored in MongoDB
   → Scheduler registers cron job for prescription frequency

2. SCHEDULE TRIGGER
   node-cron fires at scheduled time
   → Dispense Engine validates: prescription active?
     slot stock > 0?  duplicate guard window clear?
   → MQTT command published to device topic

3. PHYSICAL DISPENSING
   ESP32 receives MQTT command
   → State machine: IDLE → VERIFYING → DISPENSING
   → Stepper motor rotates drum to correct slot
   → Servo opens gate; IR sensor confirms tablet release
   → Device publishes confirmation event

4. EVENT LOGGING
   Backend receives confirmation
   → DispenseEvent written to MongoDB (immutable)
   → Slot stock count decremented
   → Low-stock threshold checked → alert if triggered

5. ANALYTICS UPDATE
   Nightly batch job processes DispenseEvent stream
   → Adherence rates, usage metrics, risk scores recalculated
   → Dashboard snapshots materialised for fast read access

6. NURSE NOTIFICATION
   Dashboard WebSocket push: new dispense event
   FCM push notification: alerts (missed dose, low stock)
```

---

## 5. IoT Device Interaction with Backend

The ESP32 device interacts with the backend through two complementary communication channels:

### 5.1 MQTT (Primary Real-Time Channel)

MQTT is used for all latency-sensitive, bidirectional device communication. The broker (Mosquitto or EMQX) manages device-specific topic namespaces:

| Topic Pattern | Direction | Payload Purpose |
|---|---|---|
| `medi/{deviceId}/command` | Server → Device | Dispense instructions, test commands, resets |
| `medi/{deviceId}/event` | Device → Server | Dispense confirmations, sensor readings |
| `medi/{deviceId}/status` | Device → Server | 30-second heartbeat with stock snapshot |
| `medi/broadcast/alert` | Server → All | Maintenance broadcasts, firmware update notices |

All MQTT sessions use TLS 1.3 transport encryption on port 8883. Device authentication uses per-device credentials (username/password) issued at registration, stored in ESP32 NVS flash.

### 5.2 REST HTTP (Secondary / Fallback Channel)

For configuration retrieval on boot and as a fallback when the MQTT broker is unreachable, the device falls back to direct REST calls:

```
GET  /api/devices/{id}/config     — Fetch slot assignments and schedule on boot
POST /api/events                  — Fallback dispense event logging (MQTT-unavailable mode)
PATCH /api/slots/{id}/stock       — Manual stock update after nurse refill scan
```

### 5.3 Device Provisioning Flow

```
Factory Reset / First Boot
  → Connect to provisioning Wi-Fi AP
  → POST /api/devices/register  { macAddress, firmwareVersion, wardId, bedNumber }
  → Receive: { deviceId, deviceSecret, mqttCredentials }
  → Store credentials in NVS flash (encrypted partition)
  → Normal operation begins
```

---

## 6. Cloud Communication Model

The system's cloud communication architecture is designed around three principles: **reliability** (messages are not silently lost), **low latency** (dispense commands reach the device within 500 ms under normal network conditions), and **graceful degradation** (the device enters a defined safe state when connectivity is lost).

```
                ┌─────────────────────────────┐
                │      Backend Server         │
                │  (Node.js + Express.js)     │
                └──────┬───────────┬──────────┘
                       │ REST      │ MQTT Publish
                       ▼           ▼
               ┌──────────┐  ┌────────────┐
               │ MongoDB  │  │MQTT Broker │
               │ (Atlas)  │  │(Mosquitto) │
               └──────────┘  └─────┬──────┘
                                   │ TLS 1.3
                              ┌────▼──────┐
                              │  ESP32    │
                              │ Dispenser │
                              └───────────┘
```

**Reliability mechanisms:**

- MQTT QoS Level 1 (at-least-once delivery) is used for all dispense commands, with backend-side deduplication using an idempotency key
- The ESP32 persists the last received command ID in EEPROM; duplicate commands within the guard window are discarded
- If MQTT connectivity is lost for more than 60 seconds, the device enters a **HOLD** state: no dispense actions occur, the LCD displays a connectivity warning, and the buzzer sounds a short periodic alert
- On reconnection, the device re-subscribes and requests a missed-event reconciliation payload from the backend

---

## 7. System Scalability Considerations

The architecture supports horizontal scaling from single-ward pilots to multi-hospital enterprise deployments without requiring structural changes.

**API Layer:** The Node.js backend is stateless — JWT authentication requires no shared session storage — enabling round-robin load balancing across multiple instances behind an NGINX reverse proxy. PM2 cluster mode utilises all available CPU cores per server node with zero-downtime rolling deployment.

**Scheduler Isolation:** The `node-cron` scheduler runs in a dedicated worker process, decoupled from the HTTP server. This prevents long-running job execution from degrading API response times and allows the scheduler to be independently scaled or moved to a dedicated worker node.

**Database Scaling:** The `dispenseevents` collection is the highest-volume collection and is designed for MongoDB sharding on the compound key `{ patientId, scheduledAt }` — matching the primary analytics query pattern. Read-heavy analytics queries are routed to replica set secondaries, isolating read load from transactional writes. Pre-computed nightly aggregates stored in `analyticsSnapshots` reduce real-time aggregation cost for dashboard reads.

**MQTT Broker Scaling:** EMQX supports horizontal broker clustering with consistent hashing for device-to-broker affinity. At projected fleet size (40–400 devices per ward), a single broker instance handles load comfortably; clustering is activated at the multi-hospital scale.

| Deployment Scale | Devices | Daily Dispense Events | Architecture Mode |
|---|---|---|---|
| Single Ward | ~40 | ~480 | Single node + single broker |
| Multi-Ward Hospital | ~400 | ~4,800 | Load-balanced API + replica set |
| Multi-Site Network | ~4,000 | ~48,000 | Sharded DB + broker cluster |

---

## 8. Security Considerations

Security is implemented as a layered, defence-in-depth model spanning transport, authentication, authorisation, and data integrity.

**Transport Security:** All client-server and device-server communication is encrypted with TLS 1.3. HTTP is redirected to HTTPS at the reverse proxy. MQTT communication uses TLS on port 8883 with per-device certificate or credential-based authentication.

**Authentication & Authorisation:** Human users (nurses, doctors, administrators) authenticate via **JSON Web Tokens (JWT)** with RS256 signing, 15-minute access token TTL, and 7-day rotating refresh tokens. IoT devices authenticate to the MQTT broker using device-specific credentials provisioned at registration. Role-based access control (RBAC) enforces endpoint-level permissions across four roles: `DEVICE`, `NURSE`, `DOCTOR`, and `ADMIN`.

**Input Validation:** All incoming request bodies are validated against strict **Joi schemas** at the API gateway layer. Unknown fields are stripped before processing; malformed requests are rejected with structured error responses before reaching business logic.

**Audit Log Integrity:** The `dispenseevents` collection exposes no delete or bulk-modify endpoints. A soft-flag (`voided: true`) is the only permitted state change post-write, preserving the complete chain of evidence for clinical audit. Records are retained for a minimum of seven years in compliance with healthcare data retention regulations.

**Rate Limiting & DDoS Protection:** `express-rate-limit` enforces 60 requests/minute for device endpoints and 300 requests/minute for user-facing endpoints. Requests exceeding the limit receive a `429 Too Many Requests` response.

---

## 9. Future Extensions

The current implementation establishes a robust foundation for the following planned enhancements:

1. **YOLOv8 Visual Tablet Identification** — An onboard camera module paired with a YOLOv8 nano model would enable AI-based visual confirmation of tablet identity prior to dispensing, providing a hardware-independent secondary verification layer that is resilient to slot mislabelling.

2. **HL7 FHIR EHR Integration** — Bidirectional synchronisation with hospital Electronic Health Record systems (Epic, OpenMRS) via the HL7 FHIR R4 API would enable automatic prescription ingestion, eliminating manual data entry and aligning the system with healthcare interoperability standards.

3. **LSTM Adherence Forecasting** — Replacing the current rule-based risk scoring with a Long Short-Term Memory (LSTM) sequence model trained on historical dispense event time-series would produce patient-specific adherence forecasts, enabling earlier identification of deteriorating adherence trajectories.

4. **RFID Medication Cartridge Tags** — Adding an RFID reader to each slot would provide hardware-level medication identity verification independent of the software slot assignment, adding a redundant verification layer.

5. **Federated Cross-Hospital Learning** — A federated learning framework would enable risk model improvement using data from multiple hospital deployments without centralising sensitive patient records, addressing both regulatory constraints and the data-volume requirements of deep learning models.

6. **Voice Interface for Nursing Staff** — Integration of a Whisper ASR model would support hands-free dose confirmations and status queries, reducing interaction friction in high-workload clinical environments.

---

## 10. Conclusion

MEDI-DISPENSE demonstrates that a carefully designed integration of IoT hardware, a lightweight cloud backend, and AI-driven analytics can substantially improve the safety, traceability, and clinical intelligence of hospital medication administration. The architecture's layered design — separating physical actuation, business logic, persistence, and presentation into distinct, independently scalable tiers — provides a solid foundation for both single-ward pilots and enterprise-scale deployments. The risk detection engine, combining adherence monitoring, anomaly detection, and stock intelligence into a composite patient risk score, converts raw dispense event data into actionable clinical insights that enable proactive nursing intervention before adverse medication events occur.

---

### References

[1] World Health Organization. (2017). *Medication Without Harm — Global Patient Safety Challenge*. WHO Press, Geneva.

[2] Poon, E. G. et al. (2010). Effect of bar-code technology on the safety of medication administration. *N Engl J Med*, 362(18), 1698–1707.

[3] Alotaibi, Y. K., & Federico, F. (2017). The impact of health information technology on patient safety. *Saudi Medical Journal*, 38(12), 1173–1180.

[4] Redmon, J. & Farhadi, A. (2018). YOLOv3: An incremental improvement. *arXiv:1804.02767*.

[5] OASIS Standard. (2019). *MQTT Version 5.0*. OASIS Open.

---

*Document version 1.0 — AI-Powered Smart Medication Dispensing and Monitoring System (MEDI-DISPENSE)*
