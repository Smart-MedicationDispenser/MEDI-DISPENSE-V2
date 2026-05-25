const Patient = require("../models/Patient");
const DispenseEvent = require("../models/DispenseEvent");
const Slot = require("../models/Slot");

exports.getDashboardStats = async (req, res) => {
  try {

    const totalPatients = await Patient.countDocuments();

    const lowStock = await Slot.countDocuments({
      $expr: { $lte: ["$currentStock", "$lowStockThreshold"] }
    });

    const today = new Date();
    today.setHours(0,0,0,0);

    const todayDispenses = await DispenseEvent.countDocuments({
      createdAt: { $gte: today }
    });

    res.json({
      totalPatients,
      lowStockMedications: lowStock,
      todayDispenses
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};