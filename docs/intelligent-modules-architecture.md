# Architecture Preparation Phase: Future Intelligent Modules

This document outlines the planned architecture for the upcoming intelligent healthcare features, and how the newly scaffolded modules will interact with the existing backend.

## 1. Computer Vision & Verification Module

### Components
*   **Backend Service**: `backend/services/verification.service.js`
*   **Frontend Page**: `medidispense-ui/src/pages/VerificationQueue.jsx`

### Interaction Flow
1.  When a dispensing event begins, IoT hardware will capture a photo of the pill.
2.  The image is sent to `verification.service.js` which integrates with an external Python-based OpenCV/YOLO engine.
3.  If the confidence score is below the threshold, the service flags the event.
4.  The `VerificationQueue.jsx` polls or receives a WebSocket event, showing the flagged image to a human operator for manual override or rejection.
5.  All outcomes (auto-verified, manual override, rejected) are passed to `audit.service.js` for compliance logging.

## 2. Prescription Processing & HL7 Integration

### Components
*   **Backend Service**: `backend/services/prescription.service.js`
*   **Frontend Page**: `medidispense-ui/src/pages/PrescriptionReview.jsx`

### Interaction Flow
1.  `prescription.service.js` will act as a listener/consumer for incoming HL7/FHIR messages from an external EHR (Electronic Health Record) system.
2.  Parsed prescriptions are matched against the existing `Patient` models (via `patient.service.js`).
3.  Pharmacists use `PrescriptionReview.jsx` to validate any edge cases, dosage limits, or stock constraints (interacting with `medication.service.js` and `inventory/`).
4.  Once approved, the prescription is handed off to `scheduler.service.js`.

## 3. Dispensing Orchestration & Scheduling

### Components
*   **Backend Services**: `backend/services/scheduler.service.js`, `backend/services/dispense.service.js`
*   **Frontend Page**: `medidispense-ui/src/pages/DispensingMonitor.jsx`

### Interaction Flow
1.  `scheduler.service.js` calculates exact drop times based on prescription parameters (e.g., "Take 1 pill every 8 hours").
2.  When a scheduled time is reached, `dispense.service.js` sends an MQTT message or WebSocket command to the specific IoT hardware (`device.service.js` maps device IDs to active connections).
3.  `DispensingMonitor.jsx` subscribes to real-time telemetry from `dispense.service.js` to show the physical movement of the mechanical parts and any hardware faults.
4.  Upon successful dispensing, `audit.service.js` records a completed transaction.

## Core Architectural Rules
*   **No Direct DB Access in New UI**: Frontend pages strictly call Controller APIs, which in turn call the new Service layers.
*   **Isolation**: New intelligent modules (CV, FHIR) must not break the existing simple CRUD flow for Patients, Devices, and Medications.
*   **Auditability**: Every new action must log to `audit.service.js` to maintain a chain-of-custody for regulated substances.
