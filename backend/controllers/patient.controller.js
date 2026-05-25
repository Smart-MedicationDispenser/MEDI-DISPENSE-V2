// module.exports = {
//   getPatients: null,
//   addPatient: null,
//   deletePatient: null
// };

const patientService = require('../services/patient.service');

const getPatients = (req, res) => {
  const patients = patientService.getAll();
  res.json(patients);
};

const addPatient = (req, res) => {
  const newPatient = req.body;
  const added = patientService.add(newPatient);
  res.json({ message: 'Patient added', data: added });
};

const deletePatient = (req, res) => {
  const { id } = req.params;
  patientService.remove(id);
  res.json({ message: 'Patient deleted' });
};

module.exports = { getPatients, addPatient, deletePatient };