const Device = require('../models/Device');

exports.registerDevice = async (req, res) => {
  try {
    const { deviceId, firmwareVersion, location } = req.body;

    if (!deviceId) {
      return res.status(400).json({ message: "Device ID required" });
    }

    let device = await Device.findOne({ deviceId });

    if (device) {
      return res.status(200).json({
        message: "Device already registered",
        device
      });
    }

    device = new Device({
      deviceId,
      firmwareVersion,
      location,
      status: 'online',
      lastSeen: new Date()
    });

    await device.save();

    res.status(201).json({
      message: "Device registered successfully",
      device
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};