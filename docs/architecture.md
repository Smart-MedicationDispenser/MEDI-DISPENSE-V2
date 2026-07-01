# Architecture Overview

This document provides a high-level overview of the MEDI-DISPENSE-V2 system architecture.

## System Diagram

```mermaid
graph TD
    subgraph Frontend
        UI[React / Vite UI]
        Dashboard[Caregiver Dashboard]
        Mobile[Patient Mobile View]
        UI --> Dashboard
        UI --> Mobile
    end

    subgraph Backend
        API[Node.js Express API]
        Cron[Scheduler / Node-Cron]
        Auth[JWT Auth]
        API --- Cron
        API --- Auth
    end

    subgraph Cloud
        DB[(MongoDB Atlas)]
    end

    subgraph Hardware
        ESP[ESP32 / Arduino]
        Sensors[Load Cells, IR]
        Actuators[Servos, Steppers]
        ESP --- Sensors
        ESP --- Actuators
    end

    %% Connections
    UI -- "REST (JSON)" --> API
    API -- "Mongoose" --> DB
    API -- "MQTT / HTTP" --> ESP
```

## Component Details

- **Frontend**: The user interface is built as a single-page application (SPA) using React and Vite. It provides monitoring and configuration interfaces for both caregivers and patients.
- **Backend**: The core application logic runs on Node.js using Express. It handles HTTP requests, authenticates users, runs schedule cron jobs, and coordinates dispensing events.
- **Cloud Database**: MongoDB Atlas is used as the central datastore for users, medication schedules, prescriptions, and event logs.
- **Hardware**: The physical dispenser uses an ESP32 or similar microcontroller to actuate servos, check sensor data, and dispense the pill to the patient. It communicates with the backend via MQTT or HTTP endpoints.
