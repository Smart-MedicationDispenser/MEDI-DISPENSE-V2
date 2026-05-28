const store = require('../data/alerts');

const VALID_TYPES    = ['Medication', 'Device'];
const VALID_STATUSES = ['Active', 'Warning', 'Critical', 'Resolved'];

// Derive initial status from type + desc keywords when caller does not supply one.
// Mirrors the intent of STATUS_MAP in Alerts.jsx.
const deriveStatus = (type, desc = '') => {
  const d = desc.toLowerCase();
  if (d.includes('critical') || d.includes('overdose') || d.includes('empty')) return 'Critical';
  if (d.includes('offline') || d.includes('timeout') || d.includes('battery')) return 'Warning';
  return 'Active';
};

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