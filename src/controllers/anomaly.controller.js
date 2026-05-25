const DispenseEvent = require("../models/DispenseEvent");
const Prescription = require("../models/Prescription");

exports.detectAnomalies = async (req, res) => {
  try {

    const prescriptions = await Prescription.find();

    let anomalies = [];

    for (const p of prescriptions) {

      const dispenses = await DispenseEvent.countDocuments({
        medicationId: p.medicationId
      });

      const expected = p.durationDays;

      if (dispenses > expected) {

        anomalies.push({
          medicationId: p.medicationId,
          expected,
          actual: dispenses,
          issue: "Over dispensing detected"
        });

      }

      if (dispenses < expected) {

        anomalies.push({
          medicationId: p.medicationId,
          expected,
          actual: dispenses,
          issue: "Missed medication doses"
        });

      }

    }

    res.json({
      anomalies
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};