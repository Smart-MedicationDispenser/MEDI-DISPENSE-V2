require('dotenv').config();

const express = require('express');
const connectDB = require('./src/config/db');

// ROUTE IMPORTS
const deviceRoutes = require('./src/routes/device.routes');
const medicationRoutes = require('./src/routes/medication.routes');
const patientRoutes = require('./src/routes/patient.routes');
const prescriptionRoutes = require('./src/routes/prescription.routes');
const eventRoutes = require('./src/routes/event.routes');
const slotRoutes = require('./src/routes/slot.routes');
const startMedicationScheduler = require("./src/scheduler/medication.scheduler");
const analyticsRoutes = require("./src/routes/analytics.routes");
const dashboardRoutes = require("./src/routes/dashboard.routes");
const anomalyRoutes = require("./src/routes/anomaly.routes");
const monitorRoutes = require("./src/routes/device.monitor.routes");
const medicationAnalyticsRoutes = require("./src/routes/medication.analytics.routes");
const missedDoseRoutes = require("./src/routes/missedDose.routes");
const riskRoutes = require("./src/routes/risk.routes");

// INITIALIZE EXPRESS
const app = express();

// CONNECT DATABASE
connectDB();
startMedicationScheduler();

// MIDDLEWARE
app.use(express.json());

// ROUTES
app.use('/api/device', deviceRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/slots', slotRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/anomaly", anomalyRoutes);
app.use("/api/devices", monitorRoutes);
app.use("/api/medication", medicationAnalyticsRoutes);
app.use("/api/analytics", missedDoseRoutes);
app.use("/api/risk", riskRoutes);

// TEST ROUTE
app.get('/', (req, res) => {
  res.json({ message: "Backend Running 🚀" });
});

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});