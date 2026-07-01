const settingsData = require('../data/settings');
const auditService = require('../services/audit.service');

const getSettings = async (req, res, next) => {
  try {
  res.json(await settingsData.getSettings());
  } catch (err) {
    next(err);
  }
};

const updateSettings = async (req, res, next) => {
  try {
  const updated = await settingsData.updateSettings(req.body);
  await auditService.logAction("Updated Settings", "Settings", "System", "Success");
  res.json({ message: "Settings updated", data: updated });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSettings,
  updateSettings
};
