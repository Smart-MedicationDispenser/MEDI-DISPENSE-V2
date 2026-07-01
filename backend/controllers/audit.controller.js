const auditService = require('../services/audit.service');

const getAudits = async (req, res) => {
  const audits = await auditService.getAuditTrail();
  res.json(audits);
};

module.exports = { getAudits };
