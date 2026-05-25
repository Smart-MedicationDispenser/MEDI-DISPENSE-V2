const express = require("express");
const router = express.Router();

const analyticsController = require("../controllers/analytics.controller");

router.get(
  "/patient/:patientId",
  analyticsController.getPatientAdherence
);

module.exports = router;