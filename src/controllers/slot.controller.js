// 

const Slot = require("../models/Slot");
const DispenseEvent = require("../models/DispenseEvent");

exports.dispenseTablet = async (req, res) => {
  try {

    const slot = await Slot.findById(req.params.slotId);

    if (!slot) {
      return res.status(404).json({ error: "Slot not found" });
    }

    if (slot.currentStock <= 0) {
      return res.status(400).json({ error: "Out of stock" });
    }

    // Reduce stock
    slot.currentStock -= 1;
    await slot.save();

    // Check low stock
    let lowstockalert = false;

    if (slot.currentStock <= slot.lowStockThreshold) {
      lowstockalert = true;
      console.log(`⚠ LOW STOCK ALERT: Slot ${slot.slotNumber} is running low`);
    }

    // Create dispense event
    const event = await DispenseEvent.create({
      slotId: slot._id,
      deviceId: slot.deviceId,
      medicationId: slot.medicationId,
      status: "dispensed"
    });

    res.json({
      message: "Tablet dispensed successfully",
      slot,
      lowstockalert,
      event
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};