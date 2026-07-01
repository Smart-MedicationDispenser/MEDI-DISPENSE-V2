const Prescription = require("../models/Prescription");
const DispenseEvent = require("../models/DispenseEvent");

exports.detectRisks = async (req, res) => {

  try {

    const prescriptions = await Prescription.find();

    let alerts = [];

    for (const p of prescriptions) {

      const dispensed = await DispenseEvent.countDocuments({
        medicationId: p.medicationId,
        patientId: p.patientId
      });

      const prescribed = p.durationDays;

      if (dispensed > prescribed) {

        alerts.push({
          patientId: p.patientId,
          medicationId: p.medicationId,
          risk: "Overdose risk detected"
        });

      }

      if (dispensed < prescribed / 2) {

        alerts.push({
          patientId: p.patientId,
          medicationId: p.medicationId,
          risk: "High missed dose risk"
        });

      }

    }

    res.json(alerts);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

};