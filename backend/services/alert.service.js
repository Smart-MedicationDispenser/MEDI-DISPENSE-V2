<<<<<<< HEAD

const Model = require('../models/alert.model');
const VALID_STATUSES = ['Active', 'Warning', 'Critical', 'Resolved'];

=======
const store = require('../data/alerts');

const VALID_TYPES    = ['Medication', 'Device'];
const VALID_STATUSES = ['Active', 'Warning', 'Critical', 'Resolved'];

// Derive initial status from type + desc keywords when caller does not supply one.
// Mirrors the intent of STATUS_MAP in Alerts.jsx.
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
const deriveStatus = (type, desc = '') => {
  const d = desc.toLowerCase();
  if (d.includes('critical') || d.includes('overdose') || d.includes('empty')) return 'Critical';
  if (d.includes('offline') || d.includes('timeout') || d.includes('battery')) return 'Warning';
  return 'Active';
};

<<<<<<< HEAD
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
=======
const getAll = (filters = {}) => {
  let list = store.getAll();
  if (filters.type)   list = list.filter((a) => a.type   === filters.type);
  if (filters.status) list = list.filter((a) => a.status === filters.status);
  return list;
};

const getById = (id) => store.getById(id);

const create = (data) => {
  const type    = data.type || 'Device';
  const status  = VALID_STATUSES.includes(data.status)
    ? data.status
    : deriveStatus(type, data.desc);

  const alert = {
    type,
    patient:  data.patient  || '—',
    device:   data.device   || '—',
    ward:     data.ward     || '—',
    desc:     data.desc     || '',
    time:     data.time     || new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    status
  };

  return store.add(alert);
};

const resolve = (id) => store.resolve(id);

const remove = (id) => store.remove(id);

module.exports = { getAll, getById, create, resolve, remove };
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
