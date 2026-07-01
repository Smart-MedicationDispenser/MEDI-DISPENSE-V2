const cron = require("node-cron");
const Prescription = require("../models/Prescription");
const Slot = require("../models/Slot");
const DispenseEvent = require("../models/DispenseEvent");

const startMedicationScheduler = () => {

  cron.schedule("* * * * *", async () => {

    console.log("Checking prescriptions...");

    const now = new Date();
    const currentTime =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0");

    try {

      const prescriptions = await Prescription.find({
        scheduleTime: currentTime
      });

      for (const prescription of prescriptions) {

        const slot = await Slot.findOne({
          medicationId: prescription.medicationId
        });

        if (!slot) continue;

        if (slot.currentStock <= 0) {
          console.log("Out of stock");
          continue;
        }

        slot.currentStock -= 1;
        await slot.save();

        await DispenseEvent.create({
          deviceId: slot.deviceId,
          medicationId: slot.medicationId,
          slotId: slot._id,
          status: "auto-dispensed"
        });

        console.log("Tablet auto dispensed");

      }

    } catch (err) {
      console.error(err);
    }

  });

};

module.exports = startMedicationScheduler;