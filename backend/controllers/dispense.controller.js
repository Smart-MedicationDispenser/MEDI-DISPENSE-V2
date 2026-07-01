const dispenseService = require('../services/dispense.service');
const auditService = require('../services/audit.service');

const getDispenseJobs = async (req, res, next) => {
  try {
  res.json(await dispenseService.getAll());
  } catch (err) {
    next(err);
  }
};

const updateDispenseJob = async (req, res, next) => {
  try {
  const { id } = req.params;
  const result = await dispenseService.update(id, req.body);
  if (result.error) return res.status(404).json({ error: result.error });
  await auditService.logAction("Updated Dispense Job", "Dispense", "System", `Success: ${id}`);
  res.json({ message: 'Dispense job updated', data: result.data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDispenseJobs, updateDispenseJob };
