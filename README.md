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
