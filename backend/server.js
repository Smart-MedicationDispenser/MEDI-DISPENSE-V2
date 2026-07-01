require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDatabase = require("./config/database");

const patientRoutes = require("./routes/patient.routes");
const medicationRoutes = require("./routes/medication.routes");
const deviceRoutes = require("./routes/device.routes");
const alertRoutes = require("./routes/alert.routes");
const prescriptionRoutes = require("./routes/prescription.routes");
const schedulerRoutes = require("./routes/scheduler.routes");
const auditRoutes = require("./routes/audit.routes");
const verificationRoutes = require("./routes/verification.routes");
const dispenseRoutes = require("./routes/dispense.routes");
const settingsRoutes = require("./routes/settings.routes");
const reportRoutes = require("./routes/report.routes");

const errorHandler = require("./utils/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

/* ROUTES */
app.use("/patients", patientRoutes);
app.use("/medications", medicationRoutes);
app.use("/devices", deviceRoutes);
app.use("/alerts", alertRoutes);
app.use("/prescriptions", prescriptionRoutes);
app.use("/schedules", schedulerRoutes);
app.use("/audits", auditRoutes);
app.use("/verifications", verificationRoutes);
app.use("/dispense", dispenseRoutes);
app.use("/settings", settingsRoutes);
app.use("/reports", reportRoutes);

/* ROOT */
app.get("/", (req, res) => {
  res.json({
    ok: true,
    routes: [
      "GET /patients",
      "POST /patients",
      "DELETE /patients/:id",

      "GET /medications",
      "POST /medications",
      "PUT /medications/:id",
      "DELETE /medications/:id",

      "GET /devices",
      "POST /devices",
      "PATCH /devices/:id",
      "PATCH /devices/:id/restart",
      "DELETE /devices/:id",

      "GET /alerts",
    ],
  });
});

const PORT = process.env.PORT || 5000;

// Environment validation
const REQUIRED_ENV = ['NODE_ENV'];
REQUIRED_ENV.forEach((key) => {
  if (!process.env[key] && process.env.NODE_ENV === 'production') {
    console.error(`[FATAL] Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

const seedDatabase = require("./config/seed");

connectDatabase()
  .then(seedDatabase)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
  });

app.use(errorHandler);
