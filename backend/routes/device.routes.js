const express = require('express');
const router  = express.Router();
const {
  getDevices,
  getDeviceById,
  registerDevice,
  restartDevice,
  updateDevice,
  deleteDevice
} = require('../controllers/device.controller');

// GET all devices
router.get('/', getDevices);

// GET single device
router.get('/:id', getDeviceById);

// Register new device
router.post('/', registerDevice);

// Restart device (status → Restarting)
router.patch('/:id/restart', restartDevice);

// Update device fields (telemetry patch, status, slots)
router.patch('/:id', updateDevice);

// DELETE device
router.delete('/:id', deleteDevice);

module.exports = router;