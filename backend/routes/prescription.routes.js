const express = require('express');
const router = express.Router();
const { validateRequest } = require('../middleware/validateRequest');
const prescriptionController = require('../controllers/prescription.controller');

router.get('/', prescriptionController.getPrescriptions);
router.post('/', validateRequest('prescription'), prescriptionController.addPrescription);
router.put('/:id', validateRequest('prescription'), prescriptionController.updatePrescription);
router.delete('/:id', prescriptionController.deletePrescription);

module.exports = router;
