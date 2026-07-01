const Device = require("../models/Device");
const Slot = require("../models/Slot");

exports.getDeviceStatus = async (req, res) => {
  try {

    const totalDevices = await Device.countDocuments();

    const totalSlots = await Slot.countDocuments();

    const lowStockSlots = await Slot.countDocuments({
      $expr: { $lte: ["$currentStock", "$lowStockThreshold"] }
    });

    res.json({
      totalDevices,
      totalSlots,
      lowStockSlots
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};