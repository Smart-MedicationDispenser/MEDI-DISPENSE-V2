const express = require('express');
const router  = express.Router();
const {
  getMedications,
  getMedicationById,
  addMedication,
  updateMedication,
  deleteMedication
} = require('../controllers/medication.controller');

// GET all medications
router.get('/', getMedications);

// GET single medication
router.get('/:id', getMedicationById);

// ADD medication
router.post('/', addMedication);

// UPDATE medication
router.put('/:id', updateMedication);

// DELETE medication
router.delete('/:id', deleteMedication);

module.exports = router;