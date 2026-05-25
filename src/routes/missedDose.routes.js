const express = require("express");
const router = express.Router();

const controller = require("../controllers/missedDose.controller");

router.get("/missed", controller.getMissedDoses);

module.exports = router;