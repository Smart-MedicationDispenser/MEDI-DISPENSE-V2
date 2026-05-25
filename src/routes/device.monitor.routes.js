const express = require("express");
const router = express.Router();

const monitorController = require("../controllers/device.monitor.controller");

router.get("/status", monitorController.getDeviceStatus);

module.exports = router;