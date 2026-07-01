const medicationService = require('../services/medication.service');
<<<<<<< HEAD
const auditService = require('../services/audit.service');

const getMedications = async (req, res, next) => {
  try {
  const medications = await medicationService.getAll();
  res.json(medications);
  } catch (err) {
    next(err);
  }
};

const getMedicationById = async (req, res, next) => {
  try {
  const med = await medicationService.getById(req.params.id);
=======

const getMedications = (req, res) => {
  const medications = medicationService.getAll();
  res.json(medications);
};

const getMedicationById = (req, res) => {
  const med = medicationService.getById(req.params.id);
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
  if (!med) {
    return res.status(404).json({ error: 'Medication not found' });
  }
  res.json(med);
<<<<<<< HEAD
  } catch (err) {
    next(err);
  }
};

const addMedication = async (req, res, next) => {
  try {
=======
};

const addMedication = (req, res) => {
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
  const { name, dosage, stock, threshold, expiry } = req.body;
  if (!name || !dosage || stock === undefined || threshold === undefined) {
    return res.status(400).json({ error: 'name, dosage, stock, threshold are required' });
  }
<<<<<<< HEAD
  const added = await medicationService.add({ name, dosage, stock, threshold, expiry });
  await auditService.logAction("Added Medication", "Medications", "System", `Success: ${added.id}`);
  res.status(201).json({ message: 'Medication added', data: added });
  } catch (err) {
    next(err);
  }
};

const updateMedication = async (req, res, next) => {
  try {
  const updated = await medicationService.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Medication not found' });
  }
  await auditService.logAction("Updated Medication", "Medications", "System", `Success: ${req.params.id}`);
  res.json({ message: 'Medication updated', data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteMedication = async (req, res, next) => {
  try {
  const removed = await medicationService.remove(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: 'Medication not found' });
  }
  await auditService.logAction("Deleted Medication", "Medications", "System", `Success: ${req.params.id}`);
  res.json({ message: 'Medication deleted' });
  } catch (err) {
    next(err);
  }
=======
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
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
};

module.exports = {
  getMedications,
  getMedicationById,
  addMedication,
  updateMedication,
  deleteMedication
};