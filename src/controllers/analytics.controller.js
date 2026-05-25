const Prescription = require("../models/Prescription");
const DispenseEvent = require("../models/DispenseEvent");

exports.getPatientAdherence = async (req, res) => {
  try {

    const patientId = req.params.patientId;

    const prescriptions = await Prescription.find({ patientId });

    let totalPrescribed = 0;

    for (const p of prescriptions) {
      totalPrescribed += p.durationDays;
    }

    const dispensed = await DispenseEvent.countDocuments({
      patientId
    });

    const missed = totalPrescribed - dispensed;

    const adherence =
      totalPrescribed > 0
        ? ((dispensed / totalPrescribed) * 100).toFixed(2)
        : 0;

    res.json({
      patientId,
      totalPrescribed,
      dispensed,
      missed,
      adherence: adherence + "%"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};