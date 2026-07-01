const express = require('express');
const router = express.Router();
const dispenseController = require('../controllers/dispense.controller');

router.get('/', dispenseController.getDispenseJobs);
router.put('/:id', dispenseController.updateDispenseJob);

module.exports = router;
