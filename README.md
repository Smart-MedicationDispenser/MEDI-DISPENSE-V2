<<<<<<< HEAD
<div align="center">
  
# 💊 MEDI-DISPENSE-V2

**An Intelligent, Automated Smart Medication Dispenser System**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas/database)

</div>

<br />

## 📖 Project Description

**MEDI-DISPENSE-V2** is the next generation of our smart medication dispensing system, engineered to ensure patients receive the correct medication at the correct time. By integrating a robust hardware mechanism with a modern software ecosystem, it provides real-time monitoring, automated dispensing, scheduling, and alerting functionalities.

This repository encompasses the complete backend API, the intuitive frontend UI, and integration points for the underlying hardware mechanisms, paving the way for a highly reliable, IoT-enabled healthcare solution.

---

## ✨ Key Features

- 🕒 **Automated Dispensing**: Schedule-based medication release preventing missed doses.
- 🔔 **Real-Time Alerts**: Notifications and logging for every dispensing event and missed dose.
- 📊 **Analytics Dashboard**: Comprehensive view of patient adherence and medication stock levels.
- 🔒 **Secure Architecture**: JWT-based authentication and secure endpoints.
- ☁️ **Cloud Database**: Fully integrated with MongoDB Atlas for reliable and scalable data storage.
- 📡 **IoT Ready**: Endpoints prepared for seamless integration with MQTT and physical hardware.

---

## 🛠️ Technology Stack

| Category         | Technologies Used                                                                 |
| ---------------- | --------------------------------------------------------------------------------- |
| **Frontend**     | React, Vite, React Router, TailwindCSS (via UI project)                           |
| **Backend**      | Node.js, Express.js                                                               |
| **Database**     | MongoDB Atlas, Mongoose (ODM)                                                     |
| **Security**     | JWT, bcryptjs, Helmet, cors                                                       |
| **Task Queue**   | node-cron (Scheduler)                                                             |

---

## 🏗️ System Architecture Overview

The system operates on a standard client-server model connected to an IoT hardware layer:

1. **Frontend UI**: Built with React/Vite, providing dashboards for caregivers and patients.
2. **Backend API**: An Express application managing business logic, schedules, and device state.
3. **Database**: MongoDB Atlas storing patient records, prescription data, and event logs.
4. **Hardware**: Physical dispenser fetching commands and reporting state via APIs/MQTT.

> *For a detailed diagram, see [Architecture Documentation](./docs/Architecture.md)*.

---

## 📂 Folder Structure

```text
.
├── backend/            # Backend legacy or specific services
├── docs/               # Documentation and architectural diagrams
│   └── assets/         # Images and screenshots
├── hardware/           # Hardware integration code (Arduino/C++)
├── medidispense-ui/    # React/Vite Frontend Application
├── mqtt/               # MQTT broker integration scripts
├── src/                # Core Backend Application Source
│   ├── config/         # Database and server configurations
│   ├── controllers/    # Route controllers
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routing
│   └── scheduler/      # Cron jobs and automated tasks
├── server.js           # Main Backend Entry Point
└── package.json        # Backend Dependencies
```

---

## 🚀 Installation Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- A MongoDB Atlas account (or a local MongoDB instance)

### 1. Clone the repository
```bash
git clone https://github.com/Smart-MedicationDispenser/MEDI-DISPENSE-V2.git
cd MEDI-DISPENSE-V2
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Install Frontend Dependencies
```bash
cd medidispense-ui
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory (where `server.js` resides) and configure the following variables:

```env
# Server Configuration
PORT=5000

# Database Configuration (Use your MongoDB Atlas URI)
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/medidispense?retryWrites=true&w=majority

# Security
JWT_SECRET=your_super_secure_jwt_secret
```

---

## ☁️ MongoDB Atlas Setup

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Under **Database Access**, create a new user and password.
3. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) or specify your IP.
4. Click **Connect**, choose "Connect your application", and copy the connection string.
5. Replace `<username>` and `<password>` in your `.env` file with your credentials.

---

## 🏃 Running the Project

### Start the Backend Server
From the root directory:
```bash
# For development (auto-restarts on changes)
npm run dev

# For production
npm start
```

### Start the Frontend Application
In a new terminal window:
```bash
cd medidispense-ui
npm run dev
```
The application should now be accessible at the address provided by Vite (usually `http://localhost:5173`), and the backend API at `http://localhost:5000`.

---

## 📸 Screenshots

*(Placeholders for future application screenshots)*

| Dashboard Overview | Patient Management |
| :---: | :---: |
| <img src="./docs/assets/screenshots/dashboard_placeholder.png" width="400" alt="Dashboard Placeholder"> | <img src="./docs/assets/screenshots/patient_placeholder.png" width="400" alt="Patient Placeholder"> |
| **Hardware Setup** | **Mobile View** |
| <img src="./docs/assets/screenshots/hardware_placeholder.png" width="400" alt="Hardware Placeholder"> | <img src="./docs/assets/screenshots/mobile_placeholder.png" width="400" alt="Mobile Placeholder"> |

---

## 🗺️ Future Roadmap

- [ ] Complete IoT hardware payload integration (MQTT & WebSockets).
- [ ] Implement AI-based predictive analytics for medication adherence.
- [ ] Add facial recognition or biometric authentication at the hardware level.
- [ ] Push notifications to mobile devices via Firebase (FCM).

---

## 🤝 Contributors

- **Smart-MedicationDispenser Team** - *Core Developers*

*If you would like to contribute, please fork the repository and submit a pull request.*

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgements

- Thanks to the open-source community for the incredible tools (Node.js, React, MongoDB) that made this possible.
- Inspired by the need for better adherence and independence in modern healthcare.
=======
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
# MEDI-DISPENSE-V2
IoT-enabled sustainable smart medication dispensing and verification platform with inventory monitoring, dispensing automation, and healthcare analytics.
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
