<<<<<<< HEAD

const Model = require('../models/patient.model');
const VALID_STATUSES = ['Active', 'Scheduled', 'Missed'];

const getAll = async () => Model.find({}).select('-_id -__v').lean();
const getById = async (id) => Model.findOne({ id }).select('-_id -__v').lean();

const add = async (patientData) => {
  const count = await Model.countDocuments();
  const nextId = 'P-' + String(count + 1022).padStart(4, '0');
  const newPatient = {
    id: nextId,
    name: patientData.name || 'Unknown',
    ward: patientData.ward || 'N/A',
    medication: patientData.medication || 'N/A',
    next: patientData.next || 'No Schedule',
    status: patientData.status || 'Active',
  };
  const created = await Model.create(newPatient);
  const doc = created.toObject(); delete doc._id; delete doc.__v; return doc;
};

const update = async (id, data) => {
  const existing = await Model.findOne({ id }).lean();
  if (!existing) return { error: 'Patient not found' };
  
  const name = (data.name ?? '').trim();
  const ward = (data.ward ?? '').trim();
  const medication = (data.medication ?? '').trim();
  if (!name) return { error: 'Name is required' };
  if (!ward) return { error: 'Ward is required' };
  if (!medication) return { error: 'Medication is required' };
  
  let next = (data.next ?? '').trim();
  if (next && next !== '—') {
    if (!/^\d{1,2}:\d{2}$/.test(next)) return { error: 'Next dose must be in HH:MM format (e.g. 09:30)' };
  }
  if (!next) next = '—';
  
  let status = (data.status ?? '').trim() || existing.status;
  if (!VALID_STATUSES.includes(status)) status = existing.status;
  
  const updated = await Model.findOneAndUpdate({ id }, { name, ward, medication, next, status }, { new: true }).select('-_id -__v').lean();
  return { data: updated };
};

const remove = async (id) => {
  const doc = await Model.findOneAndDelete({ id }).select('-_id -__v').lean();
  return !!doc;
};

module.exports = { getAll, getById, add, update, remove };
=======
const store = require('../data/patients');

const getAll = () => {
  return store.getAll();
};

const add = (patientData) => {
  const patients = store.getAll();

  const newPatient = {
    id: "P-" + String(patients.length + 1022).padStart(4, "0"),

    name: patientData.name || "Unknown",
    ward: patientData.ward || "N/A",
    medication: patientData.medication || "N/A",

    next: patientData.next || "No Schedule",
    status: patientData.status || "Active",
  };

  return store.add(newPatient);
};

const remove = (id) => {
  store.remove(id);
};

module.exports = { getAll, add, remove };
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
