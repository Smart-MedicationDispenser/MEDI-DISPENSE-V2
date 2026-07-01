const Medication = require('../models/Medication');

exports.createMedication = async (req, res) => {
  try {
    const { name, tabletWeightMg, expectedMass, yoloClassId } = req.body;

    const medication = await Medication.create({
        name,
        tabletWeightMg,
        expectedMass,
        yoloClassId
        });

    res.status(201).json(medication);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllMedications = async (req, res) => {
  try {
    const meds = await Medication.find();
    res.json(meds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};