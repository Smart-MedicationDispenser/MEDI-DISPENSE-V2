const express = require('express');
const router  = express.Router();
<<<<<<< HEAD
const { validateRequest } = require('../middleware/validateRequest');
=======
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
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
<<<<<<< HEAD
router.post('/', validateRequest('device'), registerDevice);
=======
router.post('/', registerDevice);
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04

// Restart device (status → Restarting)
router.patch('/:id/restart', restartDevice);

// Update device fields (telemetry patch, status, slots)
router.patch('/:id', updateDevice);

// DELETE device
router.delete('/:id', deleteDevice);

module.exports = router;