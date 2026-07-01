const Prescription = require("../models/Prescription");

exports.createPrescription = async (req, res) => {
  try {

    const prescription = new Prescription(req.body);

    await prescription.save();

    res.status(201).json(prescription);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};


exports.getPrescriptions = async (req, res) => {
  try {

    const prescriptions = await Prescription.find()
      .populate("patientId")
      .populate("medicationId");

    res.json(prescriptions);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};
