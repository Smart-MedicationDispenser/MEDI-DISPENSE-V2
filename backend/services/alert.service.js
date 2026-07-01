
const Model = require('../models/alert.model');
const VALID_STATUSES = ['Active', 'Warning', 'Critical', 'Resolved'];

const deriveStatus = (type, desc = '') => {
  const d = desc.toLowerCase();
  if (d.includes('critical') || d.includes('overdose') || d.includes('empty')) return 'Critical';
  if (d.includes('offline') || d.includes('timeout') || d.includes('battery')) return 'Warning';
  return 'Active';
};

const getAll = async (filters = {}) => {
  const query = {};
  if (filters.type) query.type = filters.type;
  if (filters.status) query.status = filters.status;
  return Model.find(query).select('-_id -__v').lean();
};

const getById = async (id) => Model.findOne({ id }).select('-_id -__v').lean();

const create = async (data) => {
  const type = data.type || 'Device';
  const status = VALID_STATUSES.includes(data.status) ? data.status : deriveStatus(type, data.desc);
  const count = await Model.countDocuments();
  const id = 'ALR-' + String(311 + count).padStart(3, '0');
  const alert = {
    id, type, patient: data.patient || '—', device: data.device || '—', ward: data.ward || '—',
    desc: data.desc || '', time: data.time || new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), status
  };
  const created = await Model.create(alert);
  const doc = created.toObject(); delete doc._id; delete doc.__v; return doc;
};

const resolve = async (id) => {
  const alert = await Model.findOne({ id }).lean();
  if (!alert) return null;
  if (alert.status === 'Resolved') return alert;
  return Model.findOneAndUpdate({ id }, { status: 'Resolved' }, { new: true }).select('-_id -__v').lean();
};

const remove = async (id) => {
  const doc = await Model.findOneAndDelete({ id }).select('-_id -__v').lean();
  return !!doc;
};

module.exports = { getAll, getById, create, resolve, remove };
