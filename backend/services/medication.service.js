
const Model = require('../models/medication.model');
const deriveStatus = (stock, threshold) => {
  const s = Number(stock), t = Number(threshold);
  if (s <= Math.floor(t / 2)) return 'Critical';
  if (s <= t) return 'Low Stock';
  return 'OK';
};

const getAll = async () => Model.find({}).select('-_id -__v').lean();
const getById = async (id) => Model.findOne({ id }).select('-_id -__v').lean();

const add = async (data) => {
  const stock = Number(data.stock), threshold = Number(data.threshold);
  const count = await Model.countDocuments();
  const nextId = 'MED-' + String(201 + count).padStart(3, '0');
  const med = { id: nextId, name: data.name, dosage: data.dosage, stock, threshold, expiry: data.expiry || null, status: deriveStatus(stock, threshold) };
  const created = await Model.create(med);
  const doc = created.toObject(); delete doc._id; delete doc.__v; return doc;
};

const update = async (id, data) => {
  const existing = await Model.findOne({ id }).lean();
  if (!existing) return null;
  const stock = data.stock !== undefined ? Number(data.stock) : existing.stock;
  const threshold = data.threshold !== undefined ? Number(data.threshold) : existing.threshold;
  const updates = {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.dosage !== undefined && { dosage: data.dosage }),
    ...(data.expiry !== undefined && { expiry: data.expiry }),
    stock, threshold, status: deriveStatus(stock, threshold)
  };
  return Model.findOneAndUpdate({ id }, updates, { new: true }).select('-_id -__v').lean();
};

const remove = async (id) => {
  const doc = await Model.findOneAndDelete({ id }).select('-_id -__v').lean();
  return !!doc;
};

module.exports = { getAll, getById, add, update, remove };
