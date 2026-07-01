const reportsData = require('../data/reports');
const auditService = require('../services/audit.service');

const getReports = async (req, res, next) => {
  try {
  res.json(await reportsData.getReports());
  } catch (err) {
    next(err);
  }
};

const generateReport = async (req, res, next) => {
  try {
  const { type } = req.body;
  if (!type) {
    return res.status(400).json({ error: "Report type is required" });
  }
  const report = await reportsData.generateReport(type);
  await auditService.logAction("Generated Report", "Reports", "System", `Success: ${report.id}`);
  res.status(201).json({ message: "Report generated", data: report });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getReports,
  generateReport
};
