const deviceService = require('../services/device.service');

const getDevices = (req, res) => {
  res.json(deviceService.getAll());
};

const getDeviceById = (req, res) => {
  const device = deviceService.getById(req.params.id);
  if (!device) return res.status(404).json({ error: 'Device not found' });
  res.json(device);
};

const registerDevice = (req, res) => {
  const { id, ward, room, slotsTotal, battery } = req.body;
  if (!id || !ward || !room || slotsTotal === undefined) {
    return res.status(400).json({ error: 'id, ward, room, slotsTotal are required' });
  }
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
};

module.exports = {
  getDevices,
  getDeviceById,
  registerDevice,
  restartDevice,
  updateDevice,
  deleteDevice
};