const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medication.controller');

router.post('/', medicationController.createMedication);
router.get('/', medicationController.getAllMedications);

module.exports = router;