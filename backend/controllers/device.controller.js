const deviceService = require('../services/device.service');
<<<<<<< HEAD
const auditService = require('../services/audit.service');

const getDevices = async (req, res, next) => {
  try {
  res.json(await deviceService.getAll());
  } catch (err) {
    next(err);
  }
};

const getDeviceById = async (req, res, next) => {
  try {
  const device = await deviceService.getById(req.params.id);
  if (!device) return res.status(404).json({ error: 'Device not found' });
  res.json(device);
  } catch (err) {
    next(err);
  }
};

const registerDevice = async (req, res, next) => {
  try {
=======

const getDevices = (req, res) => {
  res.json(deviceService.getAll());
};

const getDeviceById = (req, res) => {
  const device = deviceService.getById(req.params.id);
  if (!device) return res.status(404).json({ error: 'Device not found' });
  res.json(device);
};

const registerDevice = (req, res) => {
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
  const { id, ward, room, slotsTotal, battery } = req.body;
  if (!id || !ward || !room || slotsTotal === undefined) {
    return res.status(400).json({ error: 'id, ward, room, slotsTotal are required' });
  }
<<<<<<< HEAD
  const existing = await deviceService.getById(id.trim().toUpperCase());
  if (existing) {
    return res.status(409).json({ error: `Device ${id.toUpperCase()} already registered` });
  }
  const added = await deviceService.register({ id, ward, room, slotsTotal, battery });
  await auditService.logAction("Added Device", "Devices", "System", `Success: ${added.id}`);
  res.status(201).json({ message: 'Device registered', data: added });
  } catch (err) {
    next(err);
  }
};

const restartDevice = async (req, res, next) => {
  try {
  const id = req.params.id;
  const updated = await deviceService.restart(id);
  if (!updated) return res.status(404).json({ error: 'Device not found' });
  await auditService.logAction("Restarted Device", "Devices", "System", `Success: ${id}`);
  res.json({ message: 'Device restarting', data: updated });
  } catch (err) {
    next(err);
  }
};

const updateDevice = async (req, res, next) => {
  try {
  const id = req.params.id;
  const updated = await deviceService.update(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Device not found' });
  await auditService.logAction("Updated Device", "Devices", "System", `Success: ${id}`);
  res.json({ message: 'Device updated', data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteDevice = async (req, res, next) => {
  try {
  const id = req.params.id;
  const removed = await deviceService.remove(id);
  if (!removed) return res.status(404).json({ error: 'Device not found' });
  await auditService.logAction("Deleted Device", "Devices", "System", `Success: ${id}`);
  res.json({ message: 'Device deleted' });
  } catch (err) {
    next(err);
  }
=======
  const existing = deviceService.getById(id.trim().toUpperCase());
  if (existing) {
    return res.status(409).json({ error: `Device ${id.toUpperCase()} already registered` });
  }
  const added = deviceService.register({ id, ward, room, slotsTotal, battery });
  res.status(201).json({ message: 'Device registered', data: added });
};

const restartDevice = (req, res) => {
  const updated = deviceService.restart(req.params.id);
  if (!updated) return res.status(404).json({ error: 'Device not found' });
  res.json({ message: 'Device restarting', data: updated });
};

const updateDevice = (req, res) => {
  const updated = deviceService.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Device not found' });
  res.json({ message: 'Device updated', data: updated });
};

const deleteDevice = (req, res) => {
  const removed = deviceService.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Device not found' });
  res.json({ message: 'Device deleted' });
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
};

module.exports = {
  getDevices,
  getDeviceById,
  registerDevice,
  restartDevice,
  updateDevice,
  deleteDevice
};