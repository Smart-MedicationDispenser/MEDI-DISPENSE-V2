const medicationService = require('../services/medication.service');

const getMedications = (req, res) => {
  const medications = medicationService.getAll();
  res.json(medications);
};

const getMedicationById = (req, res) => {
  const med = medicationService.getById(req.params.id);
  if (!med) {
    return res.status(404).json({ error: 'Medication not found' });
  }
  res.json(med);
};

const addMedication = (req, res) => {
  const { name, dosage, stock, threshold, expiry } = req.body;
  if (!name || !dosage || stock === undefined || threshold === undefined) {
    return res.status(400).json({ error: 'name, dosage, stock, threshold are required' });
  }
  const added = medicationService.add({ name, dosage, stock, threshold, expiry });
  res.status(201).json({ message: 'Medication added', data: added });
};

const updateMedication = (req, res) => {
  const updated = medicationService.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Medication not found' });
  }
  res.json({ message: 'Medication updated', data: updated });
};

const deleteMedication = (req, res) => {
  const removed = medicationService.remove(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: 'Medication not found' });
  }
  res.json({ message: 'Medication deleted' });
};

module.exports = {
  getMedications,
  getMedicationById,
  addMedication,
  updateMedication,
  deleteMedication
};