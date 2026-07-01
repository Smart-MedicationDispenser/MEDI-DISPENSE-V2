// module.exports = {
//   getPatients: null,
//   addPatient: null,
//   deletePatient: null
// };

const patientService = require('../services/patient.service');
const auditService = require('../services/audit.service');

const getPatients = async (req, res, next) => {
  try {
  const patients = await patientService.getAll();
  res.json(patients);
  } catch (err) {
    next(err);
  }
};

const addPatient = async (req, res, next) => {
  try {
  const newPatient = req.body;
  const added = await patientService.add(newPatient);
  await auditService.logAction("Added Patient", "Patients", "System", `Success: ${added.id}`);
  res.json({ message: 'Patient added', data: added });
  } catch (err) {
    next(err);
  }
};

// Sprint 3 — PUT /patients/:id
const updatePatient = async (req, res, next) => {
  try {
  const { id } = req.params;
  const result  = await patientService.update(id, req.body);

  if (result.error) {
    const status = result.error === 'Patient not found' ? 404 : 400;
    return res.status(status).json({ error: result.error });
  }

  await auditService.logAction("Updated Patient", "Patients", "System", `Success: ${id}`);
  res.json({ message: 'Patient updated', data: result.data });
  } catch (err) {
    next(err);
  }
};

const deletePatient = async (req, res, next) => {
  try {
  const { id }    = req.params;
  const removed   = await patientService.remove(id);
  if (!removed) return res.status(404).json({ error: 'Patient not found' });
  await auditService.logAction("Deleted Patient", "Patients", "System", `Success: ${id}`);
  res.json({ message: 'Patient deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPatients, addPatient, updatePatient, deletePatient };
