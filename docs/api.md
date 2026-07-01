# MEDI-DISPENSE V2 API Documentation (Phase 6 Additions)

This document outlines the new backend REST API endpoints implemented in Phase 6.

All endpoints return JSON responses.

## Prescriptions API (`/prescriptions`)

*   **`GET /prescriptions`**
    *   Description: Retrieves all prescriptions.
    *   Response: `[{ id, patientId, patientName, medication, dosage, frequency, startDate, endDate, doctor, status }]`
*   **`POST /prescriptions`**
    *   Description: Creates a new prescription.
    *   Body: `{ patientId, patientName, medication, dosage, frequency, startDate, endDate, doctor, status }`
    *   Response: `{ message: "Prescription added", data: { ... } }`
*   **`PUT /prescriptions/:id`**
    *   Description: Updates an existing prescription.
    *   Body: Any fields to update.
    *   Response: `{ message: "Prescription updated", data: { ... } }`
*   **`DELETE /prescriptions/:id`**
    *   Description: Deletes a prescription.
    *   Response: `{ message: "Prescription deleted" }`

## Schedules API (`/schedules`)

*   **`GET /schedules`**
    *   Description: Retrieves all medication schedules (upcoming, completed, missed).
    *   Response: `[{ id, patient, prescriptionId, medication, deviceId, time, status }]`
*   **`PUT /schedules/:id`**
    *   Description: Updates a specific schedule block.
    *   Response: `{ message: "Schedule updated", data: { ... } }`

## Verifications API (`/verifications`)

*   **`GET /verifications`**
    *   Description: Retrieves the verification queue for pending pill validation jobs.
    *   Response: `[{ id, patient, medication, deviceId, scheduledTime, status, priority }]`
*   **`PUT /verifications/:id`**
    *   Description: Updates a specific verification block (e.g. marking it Verified/Rejected).
    *   Response: `{ message: "Verification updated", data: { ... } }`

## Dispense API (`/dispense`)

*   **`GET /dispense`**
    *   Description: Retrieves the dispensing queue for automated IoT jobs.
    *   Response: `[{ id, patient, medication, device, ward, time, status }]`
*   **`PUT /dispense/:id`**
    *   Description: Updates a dispensing block (e.g., updating hardware feedback status).
    *   Response: `{ message: "Dispense job updated", data: { ... } }`

## Audit API (`/audits`)

*   **`GET /audits`**
    *   Description: Retrieves the full system audit trail logs.
    *   Response: `[{ id, timestamp, user, module, action, result }]`
