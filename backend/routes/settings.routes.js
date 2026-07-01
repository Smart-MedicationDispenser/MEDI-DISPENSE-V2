const express = require('express');
const router = express.Router();
const { validateRequest } = require('../middleware/validateRequest');
const settingsController = require('../controllers/settings.controller');

router.get('/', settingsController.getSettings);
router.put('/', validateRequest('settings'), settingsController.updateSettings);

module.exports = router;
