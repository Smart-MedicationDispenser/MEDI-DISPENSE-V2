
const Model = require('../models/prescription.model');

const getAll = async () => Model.find({}).select('-_id -__v').lean();
const getById = async (id) => Model.findOne({ id }).select('-_id -__v').lean();

const add = async (data) => {
  const rx = {
    id: "RX-" + String(Math.floor(Math.random() * 9000) + 1000),
    patientId: data.patientId || "Unknown",
    patientName: data.patientName || "Unknown",
    medication: data.medication || "Unknown",
    dosage: data.dosage || "N/A",
    frequency: data.frequency || "N/A",
    startDate: data.startDate || "N/A",
    endDate: data.endDate || "N/A",
    doctor: data.doctor || "System",
    status: data.status || "Active"
  };
  const created = await Model.create(rx);
  const doc = created.toObject(); delete doc._id; delete doc.__v; return doc;
};

const update = async (id, data) => {
  const existing = await Model.findOne({ id }).lean();
  if (!existing) return { error: 'Prescription not found' };
  const updated = await Model.findOneAndUpdate({ id }, data, { new: true }).select('-_id -__v').lean();
  return { data: updated };
};

const remove = async (id) => {
  const doc = await Model.findOneAndDelete({ id }).select('-_id -__v').lean();
  return !!doc;
};

module.exports = { getAll, getById, add, update, remove };
