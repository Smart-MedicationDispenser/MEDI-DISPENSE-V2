const express = require('express');
const router  = express.Router();
<<<<<<< HEAD
const { validateRequest } = require('../middleware/validateRequest');
=======
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
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
<<<<<<< HEAD
router.post('/', validateRequest('medication'), addMedication);

// UPDATE medication
router.put('/:id', validateRequest('medication'), updateMedication);
=======
router.post('/', addMedication);

// UPDATE medication
router.put('/:id', updateMedication);
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04

// DELETE medication
router.delete('/:id', deleteMedication);

module.exports = router;