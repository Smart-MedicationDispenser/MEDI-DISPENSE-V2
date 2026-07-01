<<<<<<< HEAD

const Model = require('../models/device.model');
=======
const store = require('../data/devices');

// Mirrors Devices.jsx status derivation:
// battery <= 15 && Online  → Battery Low
// battery  > 15 && Battery Low → Online
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
const deriveStatus = (battery, currentStatus) => {
  if (currentStatus === 'Restarting' || currentStatus === 'Offline') return currentStatus;
  if (battery !== null && battery <= 15) return 'Battery Low';
  if (battery !== null && battery > 15 && currentStatus === 'Battery Low') return 'Online';
  return currentStatus;
};

<<<<<<< HEAD
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
=======
const getAll = () => store.getAll();

const getById = (id) => store.getById(id);

const register = (data) => {
  const battery    = data.battery !== undefined ? Number(data.battery) : null;
  const slotsTotal = Number(data.slotsTotal) || 6;

  const device = {
    id:            data.id.trim().toUpperCase(),
    ward:          data.ward.trim(),
    room:          data.room.trim(),
    battery,
    slotsUsed:     0,
    slotsTotal,
    status:        deriveStatus(battery, 'Online'),
    lastHeartbeat: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  };

  return store.add(device);
};

// Restart: set to Restarting immediately.
// Caller responsible for the delayed Online transition if needed.
const restart = (id) => {
  const device = store.getById(id);
  if (!device) return null;
  return store.update(id, { status: 'Restarting' });
};

// Generic field update — used for telemetry patches, status changes, etc.
const update = (id, data) => {
  const existing = store.getById(id);
  if (!existing) return null;

  const battery = data.battery !== undefined ? Number(data.battery) : existing.battery;
  const status  = data.status  !== undefined
    ? data.status
    : deriveStatus(battery, existing.status);

  const updates = {
    ...(data.ward          !== undefined && { ward:          data.ward }),
    ...(data.room          !== undefined && { room:          data.room }),
    ...(data.slotsUsed     !== undefined && { slotsUsed:     Number(data.slotsUsed) }),
    ...(data.slotsTotal    !== undefined && { slotsTotal:    Number(data.slotsTotal) }),
    ...(data.lastHeartbeat !== undefined && { lastHeartbeat: data.lastHeartbeat }),
    battery,
    status
  };

  return store.update(id, updates);
};

const remove = (id) => store.remove(id);

module.exports = { getAll, getById, register, restart, update, remove };
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
