const DispenseEvent = require("../models/DispenseEvent");

exports.createEvent = async (req, res) => {
  try {

    const event = new DispenseEvent(req.body);

    await event.save();

    res.status(201).json(event);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};


exports.getEvents = async (req, res) => {
  try {

    const events = await DispenseEvent.find()
      .populate("patientId")
      .populate("medicationId")
      .populate("deviceId");

    res.json(events);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};