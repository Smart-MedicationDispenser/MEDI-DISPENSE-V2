const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'backend', 'services');
const dataDir = path.join(__dirname, 'backend', 'data');

// 1. Patient Service
fs.writeFileSync(path.join(servicesDir, 'patient.service.js'), `
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
    if (!/^\\d{1,2}:\\d{2}$/.test(next)) return { error: 'Next dose must be in HH:MM format (e.g. 09:30)' };
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
`);

// 2. Medication Service
fs.writeFileSync(path.join(servicesDir, 'medication.service.js'), `
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
`);

// 3. Device Service
fs.writeFileSync(path.join(servicesDir, 'device.service.js'), `
const Model = require('../models/device.model');
const deriveStatus = (battery, currentStatus) => {
  if (currentStatus === 'Restarting' || currentStatus === 'Offline') return currentStatus;
  if (battery !== null && battery <= 15) return 'Battery Low';
  if (battery !== null && battery > 15 && currentStatus === 'Battery Low') return 'Online';
  return currentStatus;
};

const getAll = async () => Model.find({}).select('-_id -__v').lean();
const getById = async (id) => Model.findOne({ id }).select('-_id -__v').lean();

const register = async (data) => {
  const battery = data.battery !== undefined ? Number(data.battery) : null;
  const slotsTotal = Number(data.slotsTotal) || 6;
  const device = {
    id: data.id.trim().toUpperCase(),
    ward: data.ward.trim(),
    room: data.room.trim(),
    battery, slotsUsed: 0, slotsTotal,
    status: deriveStatus(battery, 'Online'),
    lastHeartbeat: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  };
  const created = await Model.create(device);
  const doc = created.toObject(); delete doc._id; delete doc.__v; return doc;
};

const restart = async (id) => {
  const device = await Model.findOne({ id }).lean();
  if (!device) return null;
  return Model.findOneAndUpdate({ id }, { status: 'Restarting' }, { new: true }).select('-_id -__v').lean();
};

const update = async (id, data) => {
  const existing = await Model.findOne({ id }).lean();
  if (!existing) return null;
  const battery = data.battery !== undefined ? Number(data.battery) : existing.battery;
  const status = data.status !== undefined ? data.status : deriveStatus(battery, existing.status);
  const updates = {
    ...(data.ward !== undefined && { ward: data.ward }),
    ...(data.room !== undefined && { room: data.room }),
    ...(data.slotsUsed !== undefined && { slotsUsed: Number(data.slotsUsed) }),
    ...(data.slotsTotal !== undefined && { slotsTotal: Number(data.slotsTotal) }),
    ...(data.lastHeartbeat !== undefined && { lastHeartbeat: data.lastHeartbeat }),
    battery, status
  };
  return Model.findOneAndUpdate({ id }, updates, { new: true }).select('-_id -__v').lean();
};

const remove = async (id) => {
  const doc = await Model.findOneAndDelete({ id }).select('-_id -__v').lean();
  return !!doc;
};

module.exports = { getAll, getById, register, restart, update, remove };
`);

// 4. Alert Service
fs.writeFileSync(path.join(servicesDir, 'alert.service.js'), `
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
`);

// 5. Prescription Service
fs.writeFileSync(path.join(servicesDir, 'prescription.service.js'), `
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
`);

// 6. Audit Service
fs.writeFileSync(path.join(servicesDir, 'audit.service.js'), `
const Model = require('../models/audit.model');

async function logAction(actionType, moduleName, userId = "System", result = "Success") {
  const entry = {
    id: 'A-' + Date.now().toString().slice(-4),
    timestamp: new Date().toISOString(),
    user: userId,
    module: moduleName,
    action: actionType,
    result: result
  };
  await Model.create(entry);
  
  // Maintain max 500 documents (simulating array bounds, optional but nice)
  const count = await Model.countDocuments();
  if (count > 500) {
    const oldest = await Model.find().sort({ timestamp: 1 }).limit(count - 500).lean();
    for (const doc of oldest) await Model.findByIdAndDelete(doc._id);
  }
  return true;
}

async function getAuditTrail(queryOptions = {}) {
  // Sort descending by timestamp like the original unshift behavior
  return Model.find({}).sort({ timestamp: -1 }).select('-_id -__v').lean();
}

module.exports = { logAction, getAuditTrail };
`);

// 7. Dispense Service
fs.writeFileSync(path.join(servicesDir, 'dispense.service.js'), `
const Model = require('../models/dispenseJob.model');

const getAll = async () => Model.find({}).select('-_id -__v').lean();
const getById = async (id) => Model.findOne({ id }).select('-_id -__v').lean();

const update = async (id, data) => {
  const existing = await Model.findOne({ id }).lean();
  if (!existing) return { error: 'Dispense job not found' };
  const updated = await Model.findOneAndUpdate({ id }, data, { new: true }).select('-_id -__v').lean();
  return { data: updated };
};

module.exports = { getAll, getById, update };
`);

console.log('Services 1-7 generated');
