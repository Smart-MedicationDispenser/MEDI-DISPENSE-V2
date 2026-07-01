const express = require('express');
const router = express.Router();
const schedulerController = require('../controllers/scheduler.controller');

router.get('/', schedulerController.getSchedules);
router.put('/:id', schedulerController.updateSchedule);

module.exports = router;
