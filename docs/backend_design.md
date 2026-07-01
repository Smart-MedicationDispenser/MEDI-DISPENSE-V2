# AI-Powered Smart Medication Dispensing and Monitoring System
## Backend System Design Document

---

> **Role:** Backend Software Architecture Specification
> **Stack:** Node.js · Express.js · MongoDB · REST API · node-cron
> **Pattern:** Layered MVC with Service-Oriented Business Logic

---

## 1. Backend Architecture Pattern

The backend follows a **Layered MVC (Model-View-Controller)** pattern extended with a dedicated **Service Layer** for business logic and an independent **Scheduler Layer** for time-driven automation. This separation ensures that no single module carries more than one responsibility, keeping the codebase testable, maintainable, and independently scalable.

```
HTTP Request
     │
     ▼
[ Routes Layer ]        — URL mapping, middleware attachment
     │
     ▼
[ Controllers Layer ]   — Request parsing, response formatting
     │
     ▼
[ Services Layer ]      — Business logic, cross-module orchestration
     │
     ▼
[ Models Layer ]        — MongoDB schema definitions, data access
     │
     ▼
[ MongoDB Database ]    — Persistent storage

[ Scheduler Layer ]  ◀── runs independently on cron schedule
     │
     └──▶ Services Layer (same path downward)
```

**Folder structure mapping:**

```
src/
├── config/          Database connection, environment variables, constants
├── controllers/     One controller file per resource domain
├── routes/          Express Router instances, grouped by resource
├── models/          Mongoose schemas — one file per collection
├── scheduler/       node-cron job definitions and job registry
├── services/        Business logic, analytics engine, risk engine
└── server.js        App bootstrap, middleware registration, port binding
```

---

## 2. Role of Routes

Routes are the **entry point** for every inbound HTTP request. Each route file instantiates an `express.Router()`, maps HTTP verbs and URL patterns to the corresponding controller method, and applies route-level middleware such as authentication guards and input validators.

Routes contain zero business logic — their sole responsibility is traffic direction.

```
src/routes/
├── patient.routes.js
├── medication.routes.js
├── prescription.routes.js
├── slot.routes.js
├── dispense.routes.js
├── analytics.routes.js
├── risk.routes.js
└── device.routes.js
```

**Example — `dispense.routes.js`:**
```js
const router = require('express').Router();
const { dispenseTablet } = require('../controllers/dispense.controller');
const { verifyDeviceToken } = require('../middleware/auth');
const { validateSlotId } = require('../middleware/validators');

router.post('/:slotId', verifyDeviceToken, validateSlotId, dispenseTablet);

module.exports = router;
```

---

## 3. Role of Controllers

Controllers sit between routes and services. They are responsible for **reading the request** (params, body, query), **calling the appropriate service method**, and **formatting the HTTP response**. Controllers do not contain business logic, database queries, or scheduling logic.

```
src/controllers/
├── patient.controller.js
├── medication.controller.js
├── prescription.controller.js
├── slot.controller.js
├── dispense.controller.js
├── analytics.controller.js
├── risk.controller.js
└── device.controller.js
```

**Example — `dispense.controller.js`:**
```js
const dispenseService = require('../services/dispense.service');

exports.dispenseTablet = async (req, res) => {
  try {
    const { slotId } = req.params;
    const result = await dispenseService.triggerDispense(slotId);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      error: err.message
    });
  }
};
```

---

## 4. Role of Models

Models define **Mongoose schemas** that map directly to MongoDB collections. Each model encodes field types, validation rules, default values, indexes, and virtual properties. Services interact with the database exclusively through model methods — no raw MongoDB driver calls appear outside the models layer.

```
src/models/
├── Patient.js          — name, DOB, ward, bed, deviceId, allergies, riskScore
├── Medication.js       — name, dosage, form, yoloClass, stockThreshold
├── Prescription.js     — patientId, medicationId, cronExpr, duration, active
├── Slot.js             — deviceId, slotNumber, medicationId, currentStock, minStock
├── DispenseEvent.js    — patientId, slotId, medicationId, scheduledAt,
│                         dispensedAt, status, irConfirmed, stockAfter
└── Device.js           — macAddress, wardId, bedNumber, firmwareVersion,
                          lastSeen, onlineStatus
```

**Example — `Slot.js` (key fields):**
```js
const SlotSchema = new mongoose.Schema({
  deviceId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  slotNumber:   { type: Number, min: 1, max: 8, required: true },
  medicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication' },
  currentStock: { type: Number, default: 0 },
  minStock:     { type: Number, default: 10 },
  lastRefilled: { type: Date }
}, { timestamps: true });

SlotSchema.index({ deviceId: 1, slotNumber: 1 }, { unique: true });
```

---

## 5. Scheduler Service — Medication Timing

The scheduler is an **independent layer** that runs alongside the Express HTTP server. It uses `node-cron` to register one job per active prescription. Each job fires at the prescription's defined schedule and calls the Dispense Service directly — bypassing the HTTP layer entirely.

```
src/scheduler/
├── index.js            — Loads all active prescriptions on startup, registers jobs
├── jobRegistry.js      — In-memory Map of { prescriptionId → CronJob }
└── reconcile.js        — Nightly job to sync registry against DB (catches drift)
```

**Scheduler lifecycle:**

```
Server Start
  └── scheduler/index.js
        └── Prescription.find({ active: true })
              └── For each prescription:
                    cron.schedule(prescription.cronExpr, () => {
                      dispenseService.triggerDispense(prescription.slotId)
                    })
                    jobRegistry.set(prescriptionId, job)

Prescription Created  →  scheduler.registerJob(prescriptionId)
Prescription Cancelled → scheduler.removeJob(prescriptionId)
```

The reconcile job runs at `00:01` daily to rebuild the registry from the database, ensuring no jobs are silently lost after server restarts or crashes.

---

## 6. Analytics Engine — Medication Usage

The analytics engine lives in `src/services/analytics.service.js` and operates exclusively on the `DispenseEvent` collection using **MongoDB aggregation pipelines**. It does not maintain any in-memory state — all metrics are derived on demand or pre-computed into a `DashboardSnapshot` collection by a nightly batch job.

**Core analytics functions:**

| Function | Query Pattern | Output |
|---|---|---|
| `getAdherenceRate(patientId, days)` | Count SUCCESS vs PENDING in window | Percentage rate + trend |
| `getMissedDoses(since)` | Match `status: MISSED`, group by patient | Missed dose list |
| `getUsageByMedication(medicationId)` | Group by day, sum dispense count | Daily consumption series |
| `getDepletionVelocity(slotId)` | Average units dispensed per day | Days until empty |
| `getDashboardSnapshot()` | Multi-stage pipeline across all collections | KPI object |

**Example — missed dose aggregation:**
```js
const missed = await DispenseEvent.aggregate([
  { $match: { status: 'MISSED', scheduledAt: { $gte: since } } },
  { $group: {
      _id: '$patientId',
      missedCount: { $sum: 1 },
      medications:  { $addToSet: '$medicationId' }
  }},
  { $sort: { missedCount: -1 } }
]);
```

---

## 7. Risk Detection Module

The risk engine (`src/services/risk.service.js`) computes a **composite patient risk score** from 0 to 100 by combining four weighted factors. It is invoked via the `GET /risk/detect` endpoint and also runs as a nightly scheduled batch job that writes scores to the `riskScores` collection.

**Scoring formula:**
```
riskScore = (adherenceFactor  × 0.35)
          + (missedDoseFactor × 0.25)
          + (anomalyFactor    × 0.25)
          + (stockFactor      × 0.15)
```

**Anomaly detection** applies a Z-score calculation to per-patient dose frequency history:
```js
function zScore(current, mean, stdDev) {
  return Math.abs((current - mean) / stdDev);
}
// zScore > 2.0 → WARNING flag
// zScore > 3.0 → CRITICAL flag
```

**Risk classification:**

| Score Range | Level | Action |
|---|---|---|
| 0 – 40 | LOW | No alert |
| 41 – 70 | MEDIUM | Dashboard flag |
| 71 – 100 | HIGH | Push alert to nurse app |

---

## 8. Device Communication Endpoints

The IoT dispenser interacts with the backend through two dedicated endpoint groups:

**Device registration and status:**
```
POST   /api/devices/register      — Provision new device, receive MQTT credentials
GET    /api/devices/:id/config     — Fetch slot assignments and active schedule on boot
PATCH  /api/devices/:id/heartbeat  — Update lastSeen timestamp, online status
```

**Post-dispense event logging (REST fallback when MQTT is unavailable):**
```
POST   /api/events                 — Log dispense event { slotId, status, irConfirmed, stockAfter }
PATCH  /api/slots/:id/stock        — Update slot stock count after nurse refill
```

**MQTT topic contract (primary channel):**

| Topic | Direction | Payload |
|---|---|---|
| `medi/{deviceId}/command` | Server → Device | `{ action, slotId, motorSteps, timeoutMs }` |
| `medi/{deviceId}/event` | Device → Server | `{ status, dispensedAt, irConfirmed, stockAfter }` |
| `medi/{deviceId}/status` | Device → Server | `{ online, stockSnapshot[], firmwareVersion }` |

The MQTT subscriber in `src/services/mqtt.service.js` listens on all device event topics, writes `DispenseEvent` documents, and triggers low-stock checks on each incoming event — without any HTTP round-trip between the device confirmation and the database write.

---

## 9. Error Handling Strategy

All errors flow through a **centralised Express error-handling middleware** registered as the last middleware in `server.js`. Controllers catch errors from services and pass them to `next(err)` rather than handling them inline, keeping error logic in one place.

```js
// src/middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  const status  = err.statusCode || 500;
  const message = err.message    || 'Internal Server Error';

  console.error(`[${req.method}] ${req.path} → ${status}: ${message}`);

  res.status(status).json({
    success: false,
    error: { code: err.code || 'INTERNAL_ERROR', message }
  });
};
```

**Custom error classes in `src/config/errors.js`:**

| Class | HTTP Status | Usage |
|---|---|---|
| `ValidationError` | 400 | Invalid request body or params |
| `NotFoundError` | 404 | Patient, slot, or device not found |
| `ConflictError` | 409 | Slot already assigned, duplicate dispense |
| `StockError` | 422 | Slot stock is zero before dispense |
| `DeviceError` | 503 | MQTT command delivery failure |

---

## 10. API Communication Model

All API responses follow a **consistent JSON envelope** to ensure predictable client-side parsing:

```json
// Success
{ "success": true,  "data": { ... }, "meta": { "timestamp": "...", "requestId": "..." } }

// Error
{ "success": false, "error": { "code": "SLOT_CONFLICT", "message": "Slot 4 is already assigned." } }
```

---

## 11. Main API Endpoints

### `POST /patients`
Registers a new patient. Validates required fields, checks for device assignment conflicts, and writes a `Patient` document. Returns the new patient object with assigned `_id`.

```json
// Request body
{ "name": "Ahmad Faris", "dateOfBirth": "1985-04-12",
  "wardId": "ward-3b", "bedNumber": "12",
  "deviceId": "DEV-7f3a91", "allergies": ["penicillin"] }

// Response 201
{ "success": true, "data": { "_id": "...", "name": "Ahmad Faris", ... } }
```

---

### `POST /medications`
Adds a new medication to the hospital formulary. Stores dosage, form, unit strength, and the `yoloClass` label used for AI visual identification.

```json
// Request body
{ "name": "Paracetamol", "brandName": "Panadol",
  "dosageMg": 500, "form": "tablet", "yoloClass": "paracetamol_500" }
```

---

### `POST /prescriptions`
Creates a prescription and automatically registers a `node-cron` job for the medication schedule. The `cronExpr` field accepts standard POSIX cron syntax. Returns the prescription document and the assigned cron schedule.

```json
// Request body
{ "patientId": "...", "medicationId": "...",
  "cronExpr": "0 8,14,20 * * *",
  "durationDays": 7, "startDate": "2025-03-07" }

// Response 201
{ "success": true, "data": { "prescriptionId": "...",
  "assignedSlot": 4, "nextDispense": "2025-03-07T08:00:00Z" } }
```

---

### `POST /slots`
Assigns a medication to a physical cartridge slot on the target device. Checks for slot occupancy conflicts before writing. Initialises `currentStock` from the request body.

```json
// Request body
{ "deviceId": "DEV-7f3a91", "slotNumber": 4,
  "medicationId": "...", "initialStock": 30, "minStock": 10 }
```

---

### `POST /dispense/:slotId`
Manually triggers a dispense for a given slot (nurse override). The service validates stock availability, checks the duplicate-dose guard window, publishes an MQTT command to the device, and awaits confirmation before writing the `DispenseEvent`.

```json
// Response 200
{ "success": true, "data": {
    "eventId": "...", "status": "SUCCESS",
    "dispensedAt": "2025-03-07T10:32:01Z",
    "stockAfter": 11, "irConfirmed": true } }
```

---

### `GET /analytics/missed`
Queries the `DispenseEvent` collection for all events with `status: MISSED` since a configurable lookback window (default: 24 hours). Groups results by patient and returns a ranked list sorted by missed dose count descending.

```json
// Response 200
{ "success": true, "data": [
    { "patientId": "...", "patientName": "Ahmad Faris",
      "missedCount": 3, "medications": ["Paracetamol", "Metformin"] }
]}
```

---

### `GET /analytics/usage`
Returns aggregated medication consumption data. Accepts `medicationId` and `period` (7d / 30d / 90d) as query parameters. Uses a MongoDB date-bucketed aggregation pipeline to produce a daily dispense count series.

```json
// Response 200
{ "success": true, "data": {
    "medicationId": "...", "name": "Paracetamol",
    "period": "7d", "totalDispensed": 63,
    "depletionVelocityPerDay": 9,
    "daysUntilEmpty": 3,
    "dailySeries": [
      { "date": "2025-03-01", "count": 9 }, ...
    ] } }
```

---

### `GET /risk/detect`
Runs the risk scoring engine across all active patients (or a single patient if `patientId` is passed as a query param). Returns a list of patients with their composite risk score, factor breakdown, and risk level classification.

```json
// Response 200
{ "success": true, "data": [
    { "patientId": "...", "name": "Ahmad Faris",
      "riskScore": 74.2, "riskLevel": "HIGH",
      "factors": {
        "adherence": 17.5, "missedDose": 22.5,
        "anomaly": 19.2,   "stock": 15.0 },
      "recommendation": "Immediate clinical review advised" }
]}
```

---

## 12. IoT Device Interaction Flow

The following sequence describes how the backend interacts with the ESP32 dispenser for a scheduler-triggered dispense event:

```
node-cron fires (prescription schedule)
  │
  ▼
dispense.service.triggerDispense(slotId)
  │
  ├── 1. Validate prescription is still active         [DB read]
  ├── 2. Check slot currentStock > 0                   [DB read]
  ├── 3. Check duplicate guard window (5-min lock)     [DB read]
  │
  ├── 4. Publish MQTT command to medi/{deviceId}/command
  │       { action: 'DISPENSE', slotId, motorSteps: 200, timeoutMs: 5000 }
  │
  ├── 5. Await device ACK on medi/{deviceId}/event  (timeout: 6s)
  │       { status: 'SUCCESS', irConfirmed: true, stockAfter: 11 }
  │
  ├── 6. Write DispenseEvent to MongoDB               [DB write]
  ├── 7. Decrement Slot.currentStock                  [DB write]
  └── 8. If stockAfter < minStock → alertService.notifyLowStock()
                                    → FCM push to nurse dashboard
```

If step 5 times out without a device ACK, the service writes a `FAILED` event and triggers a `DEVICE_TIMEOUT` alert — the motor is never assumed to have fired.

---

*Backend System Design Document v1.0 — MEDI-DISPENSE*
*Node.js · Express.js · MongoDB · node-cron · MQTT*
