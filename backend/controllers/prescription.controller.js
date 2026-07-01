const prescriptionService = require('../services/prescription.service');
const auditService = require('../services/audit.service');

const getPrescriptions = async (req, res, next) => {
  try {
  const prescriptions = await prescriptionService.getAll();
  res.json(prescriptions);
  } catch (err) {
    next(err);
  }
};

const addPrescription = async (req, res, next) => {
  try {
  const added = await prescriptionService.add(req.body);
  await auditService.logAction("Added Prescription", "Prescriptions", "System", `Success: ${added.id}`);
  res.json({ message: 'Prescription added', data: added });
  } catch (err) {
    next(err);
  }
};

const updatePrescription = async (req, res, next) => {
  try {
  const { id } = req.params;
  const result = await prescriptionService.update(id, req.body);
  if (result.error) {
    return res.status(404).json({ error: result.error });
  }
  await auditService.logAction("Updated Prescription", "Prescriptions", "System", `Success: ${id}`);
  res.json({ message: 'Prescription updated', data: result.data });
  } catch (err) {
    next(err);
  }
};

const deletePrescription = async (req, res, next) => {
  try {
  const { id } = req.params;
  const removed = await prescriptionService.remove(id);
  if (!removed) return res.status(404).json({ error: 'Prescription not found' });
  await auditService.logAction("Deleted Prescription", "Prescriptions", "System", `Success: ${id}`);
  res.json({ message: 'Prescription deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPrescriptions, addPrescription, updatePrescription, deletePrescription };
