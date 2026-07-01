const schedulerService = require('../services/scheduler.service');
const auditService = require('../services/audit.service');

const getSchedules = async (req, res, next) => {
  try {
  res.json(await schedulerService.getAll());
  } catch (err) {
    next(err);
  }
};

const updateSchedule = async (req, res, next) => {
  try {
  const { id } = req.params;
  const result = await schedulerService.update(id, req.body);
  if (result.error) return res.status(404).json({ error: result.error });
  await auditService.logAction("Updated Schedule", "Schedules", "System", `Success: ${id}`);
  res.json({ message: 'Schedule updated', data: result.data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSchedules, updateSchedule };
