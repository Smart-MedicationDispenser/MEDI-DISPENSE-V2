// const express = require("express");
// const router = express.Router();
// let patients = require("../data/patients");

// // GET all patients
// router.get("/", (req, res) => {
//   res.json(patients);
// });

// // ADD patient
// router.post("/", (req, res) => {
//   const newPatient = req.body;
//   patients.push(newPatient);
//   res.json({ message: "Patient added", data: newPatient });
// });

// // DELETE patient
// router.delete("/:id", (req, res) => {
//   const { id } = req.params;
//   patients = patients.filter(p => p.id !== id);
//   res.json({ message: "Patient deleted" });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const { validateRequest } = require('../middleware/validateRequest');
const {
  getPatients,
  addPatient,
  updatePatient,  /* Sprint 3 */
  deletePatient
} = require('../controllers/patient.controller');

// GET all patients
router.get('/', getPatients);

// ADD patient
router.post('/', validateRequest('patient'), addPatient);

// UPDATE patient — Sprint 3
router.put('/:id', validateRequest('patient'), updatePatient);

// DELETE patient
router.delete('/:id', deletePatient);

module.exports = router;