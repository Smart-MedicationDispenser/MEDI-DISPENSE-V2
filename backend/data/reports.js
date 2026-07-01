
const Model = require('../models/report.model');

const getReports = async () => Model.find({}).sort({ generatedAt: -1 }).select('-_id -__v').lean();

const generateReport = async (type) => {
  const newReport = {
    id: 'REP-' + String(Math.floor(Math.random() * 900) + 100),
    type,
    generatedAt: new Date().toISOString(),
    status: "Pending",
    format: "PDF"
  };
  const created = await Model.create(newReport);
  const doc = created.toObject(); delete doc._id; delete doc.__v; return doc;
};

module.exports = { getReports, generateReport };
