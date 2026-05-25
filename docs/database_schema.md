# AI-Powered Smart Medication Dispensing and Monitoring System
## MongoDB Database Schema Documentation

---

> **Database:** MongoDB 7.0
> **ODM:** Mongoose v7
> **Pattern:** Normalized references with selective denormalization
> **Collections:** Patients · Devices · Medications · Prescriptions · Slots · DispenseEvents

---

## Overview

The MEDI-DISPENSE database is designed around a **patient-centric data model**. The `Patient` document is the root entity from which all clinical records branch outward. Physical dispensing hardware is modelled separately in `Devices`, linked to patients via a one-to-one assignment. The `DispenseEvent` collection is the highest-volume, most analytically valuable collection — every tablet release writes one immutable record, forming the foundation for adherence tracking, risk scoring, and audit logging.

```
patients ────(1:1)────▶ devices
    │
    └──(1:N)──▶ prescriptions
                    │
                    ├──(N:1)──▶ medications
                    │               │
                    │               └──(1:1)──▶ slots ──(N:1)──▶ devices
                    │
                    └──(1:N)──▶ dispenseevents
                                    │
                                    ├──(N:1)──▶ slots
                                    ├──(N:1)──▶ medications
                                    └──(N:1)──▶ devices
```

---

## Collection 1 — `patients`

### Purpose
Stores the core demographic and clinical profile for every patient assigned to a MEDI-DISPENSE bedside unit. Acts as the **root entity** of the entire data model — all prescriptions, dispense events, and risk scores reference a patient document.

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB primary key |
| `name` | String | ✅ | Full legal name of the patient |
| `age` | Number | ✅ | Age in years at time of registration |
| `dateOfBirth` | Date | ✅ | Used for age-sensitive dosing calculations |
| `gender` | String | ✅ | `male` / `female` / `other` |
| `wardId` | String | ✅ | Hospital ward identifier (e.g. `ward-3b`) |
| `bedNumber` | String | ✅ | Bed number within the ward |
| `deviceId` | ObjectId | ✅ | Reference → `devices._id` (1:1 assignment) |
| `medicalHistory` | [String] | — | Free-text list of diagnosed conditions |
| `allergies` | [String] | — | INN drug names; checked on prescription creation |
| `bloodGroup` | String | — | e.g. `A+`, `O-` |
| `admittedAt` | Date | ✅ | Ward admission timestamp |
| `dischargedAt` | Date | — | Null while patient is admitted |
| `riskScore` | Number | — | Composite AI risk score `[0–100]`, updated nightly |
| `riskLevel` | String | — | `LOW` / `MEDIUM` / `HIGH` |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

### Example Document
```json
{
  "_id": "64f3a12b9e001c000012ab01",
  "name": "Ahmad Faris bin Zulkifli",
  "age": 52,
  "dateOfBirth": "1972-11-03T00:00:00Z",
  "gender": "male",
  "wardId": "ward-3b",
  "bedNumber": "12",
  "deviceId": "64f3a12b9e001c000012dc09",
  "medicalHistory": ["Type 2 Diabetes", "Hypertension"],
  "allergies": ["penicillin", "sulfonamides"],
  "bloodGroup": "A+",
  "admittedAt": "2025-03-01T08:00:00Z",
  "dischargedAt": null,
  "riskScore": 67.4,
  "riskLevel": "MEDIUM",
  "createdAt": "2025-03-01T08:05:12Z",
  "updatedAt": "2025-03-07T01:00:00Z"
}
```

---

## Collection 2 — `devices`

### Purpose
Represents each physical ESP32-based bedside dispensing unit. Stores hardware identity, connectivity credentials, firmware metadata, and real-time online status. The Device document is the **hardware anchor** that slots and dispense events reference to trace events back to a physical machine.

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB primary key |
| `deviceCode` | String | ✅ | Human-readable ID, e.g. `DEV-7F3A91` (unique) |
| `macAddress` | String | ✅ | Wi-Fi MAC address used for deduplication (unique) |
| `firmwareVersion` | String | ✅ | Installed firmware version, e.g. `2.1.4` |
| `wardId` | String | ✅ | Ward where device is physically located |
| `bedNumber` | String | ✅ | Bed assignment within the ward |
| `patientId` | ObjectId | — | Reference → `patients._id` (null when unassigned) |
| `mqttClientId` | String | ✅ | Unique MQTT client identifier for broker auth |
| `onlineStatus` | String | ✅ | `online` / `offline` / `hold` |
| `lastSeen` | Date | — | Timestamp of most recent heartbeat message |
| `slotCount` | Number | ✅ | Number of physical cartridge slots (typically 8) |
| `registeredAt` | Date | ✅ | Device provisioning timestamp |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

### Example Document
```json
{
  "_id": "64f3a12b9e001c000012dc09",
  "deviceCode": "DEV-7F3A91",
  "macAddress": "AA:BB:CC:DD:EE:FF",
  "firmwareVersion": "2.1.4",
  "wardId": "ward-3b",
  "bedNumber": "12",
  "patientId": "64f3a12b9e001c000012ab01",
  "mqttClientId": "medi-DEV-7F3A91",
  "onlineStatus": "online",
  "lastSeen": "2025-03-07T08:01:45Z",
  "slotCount": 8,
  "registeredAt": "2025-02-15T09:30:00Z",
  "createdAt": "2025-02-15T09:30:00Z",
  "updatedAt": "2025-03-07T08:01:45Z"
}
```

---

## Collection 3 — `medications`

### Purpose
The central **medication formulary**. Every drug available in the hospital system is registered here before it can be prescribed or loaded into a slot. Provides the canonical reference for drug name, dosage form, strength, and the AI classification label used by the YOLOv8 visual identification module.

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB primary key |
| `name` | String | ✅ | Generic (INN) drug name, e.g. `Metformin` |
| `brandName` | String | — | Commercial brand name, e.g. `Glucophage` |
| `dosage` | String | ✅ | Dose strength per unit, e.g. `500mg` |
| `form` | String | ✅ | `tablet` / `capsule` / `liquid` |
| `description` | String | — | Clinical notes or usage instructions |
| `sideEffects` | [String] | — | Known side effects for clinical reference |
| `category` | String | — | Drug class, e.g. `antidiabetic`, `antihypertensive` |
| `yoloClass` | String | — | Class label for YOLOv8 visual ID model |
| `requiresRefrigeration` | Boolean | — | Storage flag for pharmacy workflow |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

### Example Document
```json
{
  "_id": "64f3a12b9e001c000099me01",
  "name": "Metformin",
  "brandName": "Glucophage",
  "dosage": "500mg",
  "form": "tablet",
  "description": "First-line oral antidiabetic for Type 2 Diabetes management.",
  "sideEffects": ["nausea", "diarrhea", "abdominal discomfort"],
  "category": "antidiabetic",
  "yoloClass": "metformin_500",
  "requiresRefrigeration": false,
  "createdAt": "2025-01-10T12:00:00Z",
  "updatedAt": "2025-01-10T12:00:00Z"
}
```

---

## Collection 4 — `prescriptions`

### Purpose
Encodes the clinical medication order for a patient. Each prescription links a patient to a specific medication with a defined dose, frequency, and duration. The `cronExpression` field drives the `node-cron` scheduler — one cron job is registered per active prescription and fires the dispense engine at the correct times.

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB primary key |
| `patientId` | ObjectId | ✅ | Reference → `patients._id` |
| `medicationId` | ObjectId | ✅ | Reference → `medications._id` |
| `prescribedBy` | String | ✅ | Prescribing doctor's name or staff ID |
| `dosage` | String | ✅ | Dose per dispense event, e.g. `500mg` |
| `dosageQty` | Number | ✅ | Number of tablets per dispense (typically 1 or 2) |
| `scheduleTime` | [String] | ✅ | Human-readable times, e.g. `["08:00","14:00","20:00"]` |
| `cronExpression` | String | ✅ | POSIX cron syntax driving the scheduler, e.g. `0 8,14,20 * * *` |
| `durationDays` | Number | ✅ | Total prescription length in days |
| `startDate` | Date | ✅ | First scheduled dispense date |
| `endDate` | Date | ✅ | Computed as `startDate + durationDays` |
| `active` | Boolean | ✅ | `true` while prescription is in effect |
| `notes` | String | — | Clinical notes from the prescribing doctor |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

### Example Document
```json
{
  "_id": "64f3a12b9e001c000088rx01",
  "patientId": "64f3a12b9e001c000012ab01",
  "medicationId": "64f3a12b9e001c000099me01",
  "prescribedBy": "Dr. Nurul Huda (Staff ID: MO-2291)",
  "dosage": "500mg",
  "dosageQty": 1,
  "scheduleTime": ["08:00", "14:00", "20:00"],
  "cronExpression": "0 8,14,20 * * *",
  "durationDays": 7,
  "startDate": "2025-03-07T00:00:00Z",
  "endDate": "2025-03-14T00:00:00Z",
  "active": true,
  "notes": "Take with food. Monitor for GI side effects.",
  "createdAt": "2025-03-06T16:45:00Z",
  "updatedAt": "2025-03-06T16:45:00Z"
}
```

---

## Collection 5 — `slots`

### Purpose
Maps a physical cartridge slot on a dispenser device to a specific medication. Each device has up to 8 numbered slots. The Slot document tracks **live inventory** — `currentStock` is decremented on every successful dispense and incremented when a nurse refills the cartridge. The low-stock threshold triggers nurse alerts when stock drops below the configured minimum.

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB primary key |
| `deviceId` | ObjectId | ✅ | Reference → `devices._id` |
| `slotNumber` | Number | ✅ | Physical position `1–8` on the device drum |
| `medicationId` | ObjectId | ✅ | Reference → `medications._id` |
| `currentStock` | Number | ✅ | Current number of tablets remaining |
| `lowStockThreshold` | Number | ✅ | Minimum stock before alert is triggered |
| `capacity` | Number | ✅ | Maximum tablets the slot physically holds |
| `lastRefilled` | Date | — | Timestamp of most recent nurse refill |
| `lastDispenedAt` | Date | — | Timestamp of the most recent successful dispense |
| `active` | Boolean | ✅ | `false` if slot is disabled or under maintenance |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

> **Unique constraint:** `{ deviceId, slotNumber }` — no two slots on the same device can share the same position number.

### Example Document
```json
{
  "_id": "64f3a12b9e001c000077sl04",
  "deviceId": "64f3a12b9e001c000012dc09",
  "slotNumber": 4,
  "medicationId": "64f3a12b9e001c000099me01",
  "currentStock": 18,
  "lowStockThreshold": 10,
  "capacity": 30,
  "lastRefilled": "2025-03-05T09:15:00Z",
  "lastDispensedAt": "2025-03-07T08:00:02Z",
  "active": true,
  "createdAt": "2025-02-15T09:45:00Z",
  "updatedAt": "2025-03-07T08:00:02Z"
}
```

---

## Collection 6 — `dispenseevents`

### Purpose
The **immutable audit log** of every tablet dispense attempt in the system. One document is written for each scheduler-triggered or nurse-initiated dispense — whether it succeeds, fails, or results in a missed dose. This collection is the primary data source for the adherence monitoring engine, the missed-dose detector, the usage analytics module, and the AI risk scoring engine.

No DELETE endpoint is exposed for this collection. Records are retained indefinitely for clinical and regulatory audit purposes.

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Auto | MongoDB primary key (immutable) |
| `patientId` | ObjectId | ✅ | Reference → `patients._id` |
| `prescriptionId` | ObjectId | ✅ | Reference → `prescriptions._id` |
| `medicationId` | ObjectId | ✅ | Reference → `medications._id` |
| `slotId` | ObjectId | ✅ | Reference → `slots._id` |
| `deviceId` | ObjectId | ✅ | Reference → `devices._id` |
| `scheduledAt` | Date | ✅ | The cron-defined time this dose was due |
| `dispensedAt` | Date | — | Actual physical release timestamp (null if MISSED/FAILED) |
| `status` | String | ✅ | `SUCCESS` / `MISSED` / `FAILED` / `SKIPPED` |
| `dosageQty` | Number | ✅ | Number of tablets dispensed in this event |
| `stockAfter` | Number | — | Slot stock count immediately after dispense |
| `irConfirmed` | Boolean | — | Whether the IR sensor confirmed physical tablet release |
| `triggeredBy` | String | ✅ | `scheduler` / `nurse_override` / `manual_test` |
| `failureReason` | String | — | Populated if status is `FAILED` — e.g. `DEVICE_TIMEOUT`, `STOCK_EMPTY` |
| `notes` | String | — | Optional clinical annotation by nursing staff |
| `createdAt` | Date | Auto | Mongoose timestamp (write time) |

### Example Document
```json
{
  "_id": "64f3a12b9e001c000055ev01",
  "patientId": "64f3a12b9e001c000012ab01",
  "prescriptionId": "64f3a12b9e001c000088rx01",
  "medicationId": "64f3a12b9e001c000099me01",
  "slotId": "64f3a12b9e001c000077sl04",
  "deviceId": "64f3a12b9e001c000012dc09",
  "scheduledAt": "2025-03-07T08:00:00Z",
  "dispensedAt": "2025-03-07T08:00:02Z",
  "status": "SUCCESS",
  "dosageQty": 1,
  "stockAfter": 18,
  "irConfirmed": true,
  "triggeredBy": "scheduler",
  "failureReason": null,
  "notes": null,
  "createdAt": "2025-03-07T08:00:03Z"
}
```

---

## 7. Relationships Between Collections

| Relationship | Type | How It Works |
|---|---|---|
| `patients` → `devices` | 1 : 1 | `patients.deviceId` references `devices._id` |
| `patients` → `prescriptions` | 1 : N | `prescriptions.patientId` references `patients._id` |
| `prescriptions` → `medications` | N : 1 | `prescriptions.medicationId` references `medications._id` |
| `prescriptions` → `dispenseevents` | 1 : N | `dispenseevents.prescriptionId` references `prescriptions._id` |
| `devices` → `slots` | 1 : N | `slots.deviceId` references `devices._id` (up to 8 slots per device) |
| `slots` → `medications` | N : 1 | `slots.medicationId` references `medications._id` |
| `dispenseevents` → `slots` | N : 1 | `dispenseevents.slotId` references `slots._id` |
| `dispenseevents` → `devices` | N : 1 | `dispenseevents.deviceId` references `devices._id` |
| `dispenseevents` → `medications` | N : 1 | `dispenseevents.medicationId` references `medications._id` |

> **Design note:** `dispenseevents` stores direct references to both `slotId` and `deviceId` even though `slot` already references `device`. This deliberate **denormalization** means analytics queries on dispense events never need to join through the `slots` collection to resolve the device, keeping aggregation pipelines fast and simple.

---

## 8. Indexing Strategy

Indexes are defined at the Mongoose schema level and applied to MongoDB on application startup. The strategy targets the three dominant query patterns: **analytics scans** (time-range queries on `dispenseevents`), **real-time lookups** (patient + device resolution), and **scheduler validation** (active prescription checks before each dispense).

### `patients`
```js
{ deviceId: 1 }               // Device → patient lookup
{ wardId: 1 }                 // Ward-level dashboard queries
{ riskLevel: 1 }              // Risk dashboard: filter HIGH-risk patients
```

### `devices`
```js
{ macAddress: 1 }  unique     // Deduplication on registration
{ wardId: 1, onlineStatus: 1} // Fleet monitoring by ward
```

### `prescriptions`
```js
{ patientId: 1, active: 1 }   // Active prescription lookup per patient
{ endDate: 1, active: 1 }     // Nightly job: expire completed prescriptions
```

### `slots`
```js
{ deviceId: 1, slotNumber: 1 }  unique   // Slot conflict detection
{ deviceId: 1, currentStock: 1 }         // Low-stock threshold scan
```

### `dispenseevents` — Primary analytics collection
```js
{ patientId: 1, scheduledAt: -1 }    // Adherence rate queries (most frequent)
{ status: 1, scheduledAt: -1 }       // Missed-dose detection scan
{ medicationId: 1, dispensedAt: -1 } // Usage analytics per medication
{ deviceId: 1, createdAt: -1 }       // Device-level audit trail
{ scheduledAt: 1 }                   // TTL candidate for raw telemetry cleanup
```

---

## 9. Scalability Considerations

### Collection Growth Projections

| Collection | Growth Rate | Dominant Query | Strategy |
|---|---|---|---|
| `patients` | Low (hundreds) | Point lookup by `_id` | Simple index, no sharding needed |
| `devices` | Low (hundreds) | Heartbeat update | Single-field index on `deviceId` |
| `medications` | Very low (static formulary) | Read-heavy, infrequent writes | Cacheable at application layer |
| `prescriptions` | Medium (thousands/year) | Active prescription scan | Partial index on `{ active: true }` |
| `slots` | Low (8 × device count) | Stock decrement on dispense | Targeted by `{ deviceId, slotNumber }` |
| `dispenseevents` | **High** (~480/day per 40 patients) | Time-range aggregation | **Sharding candidate** |

### Sharding `dispenseevents`

At multi-ward scale (400+ patients, 4,800+ events/day), `dispenseevents` becomes the performance bottleneck. The recommended shard key is:

```js
{ patientId: 1, scheduledAt: 1 }
```

This key aligns with the primary analytics query pattern (per-patient time-range scans), distributes writes evenly across shards (patient IDs are high-cardinality), and avoids hotspots caused by monotonically increasing timestamps used alone.

### Pre-Computed Aggregates

Real-time adherence rate and risk score calculations across large patient populations are expensive when run on-demand. The recommended pattern is a **nightly materialization job** that runs at `01:00` and writes pre-computed results to two lightweight snapshot collections:

```
analyticsSnapshots   — { patientId, date, adherenceRate, missedCount, usageSeries }
riskScores           — { patientId, score, level, factors, computedAt }
```

Dashboard API endpoints read from these snapshots rather than executing live aggregations, keeping response times under 100ms regardless of database size.

### TTL Index for Telemetry Cleanup

High-frequency device heartbeat documents and raw sensor readings can be automatically expired using a MongoDB TTL index:

```js
// Expire raw heartbeat documents after 90 days
DeviceHeartbeat.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 })
```

Core `dispenseevents` records are **never** subject to TTL expiry — they must be retained for clinical audit.

---

*Database Schema Documentation v1.0 — MEDI-DISPENSE*
*MongoDB 7.0 · Mongoose v7 · Six-Collection Patient-Centric Model*
