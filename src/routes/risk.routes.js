const express = require("express");
const router = express.Router();

const riskController = require("../controllers/riskDetection.controller");

router.get("/detect", riskController.detectRisks);

module.exports = router;