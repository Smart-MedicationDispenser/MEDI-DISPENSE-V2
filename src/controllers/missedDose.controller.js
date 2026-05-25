const Prescription = require("../models/Prescription");
const DispenseEvent = require("../models/DispenseEvent");

exports.getMissedDoses = async (req, res) => {

  try {

    const prescriptions = await Prescription.find();

    let report = [];

    for (const p of prescriptions) {

      const dispensed = await DispenseEvent.countDocuments({
        medicationId: p.medicationId,
        patientId: p.patientId
      });

      const prescribed = p.durationDays;

      let missed = prescribed - dispensed;

      if (missed < 0) missed = 0;

      report.push({
        patientId: p.patientId,
        medicationId: p.medicationId,
        prescribed,
        dispensed,
        missed
      });

    }

    res.json(report);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

};