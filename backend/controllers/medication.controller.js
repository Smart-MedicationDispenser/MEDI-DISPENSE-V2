const medicationService = require('../services/medication.service');
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
  if (!med) {
    return res.status(404).json({ error: 'Medication not found' });
  }
  res.json(med);
  } catch (err) {
    next(err);
  }
};

const addMedication = async (req, res, next) => {
  try {
  const { name, dosage, stock, threshold, expiry } = req.body;
  if (!name || !dosage || stock === undefined || threshold === undefined) {
    return res.status(400).json({ error: 'name, dosage, stock, threshold are required' });
  }
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
};

module.exports = {
  getMedications,
  getMedicationById,
  addMedication,
  updateMedication,
  deleteMedication
};