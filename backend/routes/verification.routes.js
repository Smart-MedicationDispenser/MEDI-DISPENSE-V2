const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verification.controller');

router.get('/', verificationController.getVerifications);
router.put('/:id', verificationController.updateVerification);

module.exports = router;
