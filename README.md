# MEDI-DISPENSE 1.1
### IoT-Based Smart Bedside Medication Dispensing & Monitoring System

---

## 📌 Project Overview

**MEDI-DISPENSE** is an IoT-enabled automated bedside medication dispensing platform designed for hospitals, assisted living environments, and remote patient monitoring.

The system combines **embedded automation, cloud backend services, and intelligent analytics** to ensure accurate medication dispensing and continuous monitoring of patient adherence.

MEDI-DISPENSE aims to reduce medication errors, improve adherence tracking, and enable caregivers to monitor medication events in real time.

The platform consists of three major layers:

• Mechanical Dispensing System  
• Embedded IoT Controller  
• Cloud Backend & Analytics Engine  

---

# 🏗 System Architecture

The system is structured as a multi-layer architecture integrating hardware automation and cloud software.

## Mechanical Layer

Responsible for the physical dispensing process.

Components include:

• Linear blister feed mechanism (NEMA17 + Lead Screw)  
• Servo-actuated tablet popper (MG996R)  
• Camera verification bay  
• Gravity funnel delivery system  
• Load-cell measurement tray  

---

## Embedded Layer

The embedded controller manages actuation and communicates with the backend server.

Components:

• ESP32 microcontroller  
• HX711 load-cell ADC  
• Stepper motor driver (DRV8825 / A4988)  
• Servo motor PWM control  
• Wi-Fi communication module  
• MQTT telemetry (planned)

The ESP32 device sends events to the backend system and receives commands for dispensing operations.

---

## Cloud Backend Layer (This Repository)

The backend server handles device coordination, event logging, analytics, and system monitoring.

Implemented using:

• Node.js  
• Express.js  
• MongoDB  
• REST APIs  

Core responsibilities include:

• Device registration  
• Patient management  
• Medication management  
• Prescription scheduling  
• Tablet dispensing API  
• Inventory monitoring  
• Dispense event logging  
• Patient adherence analytics  
• Missed dose detection  
• Risk detection engine  
• System dashboard statistics  

---

# 🧠 Backend Intelligence Modules

The backend platform includes multiple intelligent monitoring modules.

## Medication Usage Analytics

Tracks medication usage patterns and dispensing frequency.

## Patient Adherence Monitoring

Calculates medication adherence percentage based on prescribed vs dispensed doses.

## Missed Dose Detection

Identifies instances where scheduled medications were not dispensed.

## Risk Detection Engine

Detects abnormal patterns such as:

• High missed dose probability  
• Overdose risk  
• Abnormal dispensing frequency  

## System Dashboard Analytics

Provides real-time statistics for system monitoring.

---

# 📂 Project Structure
src/
├── config/
├── controllers/
├── models/
├── routes/
├── scheduler/
├── services/
└── server.js

docs/
├── system_architecture.md
├── backend_design.md
├── database_schema.md
├── workflow.md
└── diagrams/


---

# 🚀 API Endpoints

## Device Management

POST /api/device/register  
GET /api/devices/status  

## Patient Management

POST /api/patients  
GET /api/patients  

## Medication Management

POST /api/medications  
GET /api/medications  

## Prescription Management

POST /api/prescriptions  

## Tablet Dispensing

POST /api/slots/dispense/:slotId  

## Analytics APIs

GET /api/analytics/patient/:id  
GET /api/analytics/missed  
GET /api/medication/usage  

## Risk Detection

GET /api/risk/detect  

## Dashboard Monitoring

GET /api/dashboard/stats  

---

# 🧪 Development Setup

## 1️⃣ Install Dependencies
npm install

---

## 2️⃣ Configure Environment Variables

Create a `.env` file in the root directory.
MONGO_URI=mongodb://127.0.0.1:27017/medidispense
PORT=5000


---

## 3️⃣ Run Backend Server
npm run dev


Server will run on:
http://localhost:5000

---

# 🗄 Database

The system uses **MongoDB** with the following collections:

• Patients  
• Devices  
• Medications  
• Prescriptions  
• Slots  
• DispenseEvents  

Detailed schema documentation is available in:


docs/database_schema.md


---

# 🔮 Planned Future Enhancements

• MQTT telemetry ingestion  
• Edge AI tablet verification (YOLOv8)  
• Load-cell mass validation  
• Nurse notification system  
• Android mobile dashboard  
• Real-time device monitoring  
• Cloud deployment  
• Multi-hospital scalability  

---

# 🏥 Application Context

MEDI-DISPENSE is designed for environments where medication adherence and safety are critical.

Use cases include:

• Elderly bedside care  
• Assisted living facilities  
• Cognitive impairment medication management  
• Remote caregiver monitoring  
• Hospital ward automation  

---

# 🛠 Technology Stack

## Backend
Node.js  
Express.js  

## Database
MongoDB  

## Embedded System
ESP32  
DRV8825 / A4988  
HX711 Load Cell  

## AI (planned)
YOLOv8 tablet verification  

## Communication
REST APIs  
MQTT (planned)

---

# 📊 Documentation

Full technical documentation is available in the **docs/** folder.

Includes:

• System Architecture  
• Backend Design  
• Database Schema  
• System Workflow  
• Architecture Diagrams  

---

# 👥 Project Information

Project: **MEDI-DISPENSE 1.1**  
Version: **Rev A**  
Date: **February 2026**

Developed as part of an **IoT-based intelligent healthcare automation system**.
