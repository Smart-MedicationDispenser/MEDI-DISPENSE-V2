const express = require("express");
const router = express.Router();

const analyticsController = require("../controllers/medication.analytics.controller");

router.get("/usage", analyticsController.getMedicationUsage);

module.exports = router;