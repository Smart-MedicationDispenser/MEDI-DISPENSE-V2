const express = require("express");
const cors = require("cors");

const patientRoutes = require("./routes/patient.routes");

const app = express();

app.use(cors());
app.use(express.json());

/* PATIENT ROUTES */
app.use("/patients", patientRoutes);

/* EXISTING DEVICES */
const devices = [
  { id: "DEV-7F3A", status: "online", battery: 87 },
  { id: "DEV-9A12", status: "offline", battery: null },
  { id: "DEV-5C8D", status: "online", battery: 22 },
];

/* EXISTING ALERTS */
const alerts = [
  { id: "ALR-001", type: "low_stock", message: "Metformin below ward threshold" },
  { id: "ALR-002", type: "refill", message: "Insulin refill due this week" },
  { id: "ALR-003", type: "critical", message: "Paracetamol slot empty — Ward 5B" },
];

app.get("/devices", (req, res) => {
  res.json(devices);
});

app.get("/alerts", (req, res) => {
  res.json(alerts);
});

app.get("/", (req, res) => {
  res.json({
    ok: true,
    routes: [
      "GET /patients",
      "POST /patients",
      "DELETE /patients/:id",
      "GET /devices",
      "GET /alerts",
    ],
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});