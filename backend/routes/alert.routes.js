const express = require('express');
const router  = express.Router();
const {
  getAlerts,
  getAlertById,
  createAlert,
  resolveAlert,
  deleteAlert
} = require('../controllers/alert.controller');

// GET all alerts (optional ?type= ?status= filters)
router.get('/', getAlerts);

// GET single alert
router.get('/:id', getAlertById);

// CREATE alert (for future "+ Create Alert" button)
router.post('/', createAlert);

// RESOLVE alert  →  status: "Resolved"
router.patch('/:id/resolve', resolveAlert);

// IGNORE / DELETE alert
router.delete('/:id', deleteAlert);

module.exports = router;