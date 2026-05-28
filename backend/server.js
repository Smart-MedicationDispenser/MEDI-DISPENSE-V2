const express = require("express");
const cors = require("cors");

const patientRoutes = require("./routes/patient.routes");
const medicationRoutes = require("./routes/medication.routes");
const deviceRoutes = require("./routes/device.routes");
const alertRoutes = require("./routes/alert.routes");

const app = express();

app.use(cors());
app.use(express.json());

/* ROUTES */
app.use("/patients", patientRoutes);
app.use("/medications", medicationRoutes);
app.use("/devices", deviceRoutes);
app.use("/alerts", alertRoutes);

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});