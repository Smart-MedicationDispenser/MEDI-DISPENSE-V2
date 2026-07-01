# Integration Readiness Guide

This document outlines the planned integration points for the upcoming Phase 7 (Intelligent Modules). **Do not implement these features yet; this is purely structural planning.**

## 1. Computer Vision (OpenCV / YOLO)

**Target Module**: `/verifications`
**Integration Plan**:
- A Python microservice will run OpenCV and YOLO inference on camera feeds.
- The Python service will POST flagged anomalies to the Node.js backend: `POST /api/v1/verifications`.
- The `VerificationQueue` UI will poll or listen via WebSockets for these events and allow the pharmacist to manually "Resolve" or "Reject" the flagged frame.

## 2. IoT Dispensing (ESP32 / MQTT)

**Target Module**: `/dispense`
**Integration Plan**:
- Node.js will host an MQTT Broker (e.g., Aedes) or connect to an external broker (Mosquitto).
- When a schedule block hits its time, `scheduler.service.js` will publish an MQTT payload to `medidispense/ward3/dispense`.
- The ESP32 hardware will subscribe to this topic, rotate the stepper motors to drop the pill, and publish a success/fail message back to `medidispense/ward3/feedback`.
- The Node backend will update the `/dispense` database based on this feedback.

## 3. Cloud Database (MongoDB/PostgreSQL)

**Target Module**: `/backend/data/*`
**Integration Plan**:
- The current in-memory arrays in `backend/data` will be completely swapped out for Mongoose schemas or Prisma models.
- Since the application logic is already abstracted into `services/`, the Express Controllers will not need to change. We will only rewrite the database query implementation inside the services.

## 4. RFID Authentication

**Target Module**: `/audits` and Login
**Integration Plan**:
- Nurses will swipe RFID badges on the cart.
- ESP32 reads the UID and sends an MQTT message to the backend.
- Backend resolves the UID to a Nurse Profile and unlocks the UI screen.
- All subsequent actions are logged in `audit.service.js` under the identified Nurse's name instead of "System".
