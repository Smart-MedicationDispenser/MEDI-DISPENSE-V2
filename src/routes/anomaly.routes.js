const express = require("express");
const router = express.Router();

const anomalyController = require("../controllers/anomaly.controller");

router.get("/detect", anomalyController.detectAnomalies);

module.exports = router;