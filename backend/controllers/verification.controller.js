const verificationService = require('../services/verification.service');
const auditService = require('../services/audit.service');

const getVerifications = async (req, res, next) => {
  try {
  res.json(await verificationService.getAll());
  } catch (err) {
    next(err);
  }
};

const updateVerification = async (req, res, next) => {
  try {
  const { id } = req.params;
  const result = await verificationService.update(id, req.body);
  if (result.error) return res.status(404).json({ error: result.error });
  await auditService.logAction("Updated Verification", "Verification", "System", `Success: ${id}`);
  res.json({ message: 'Verification updated', data: result.data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getVerifications, updateVerification };
