const DispenseEvent = require("../models/DispenseEvent");

exports.getMedicationUsage = async (req, res) => {
  try {

    const usage = await DispenseEvent.aggregate([
      {
        $group: {
          _id: "$medicationId",
          totalDispensed: { $sum: 1 }
        }
      }
    ]);

    res.json(usage);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};