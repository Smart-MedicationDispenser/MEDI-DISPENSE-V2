const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'backend', 'services');
const dataDir = path.join(__dirname, 'backend', 'data');

// 8. Scheduler Service
fs.writeFileSync(path.join(servicesDir, 'scheduler.service.js'), `
const Model = require('../models/schedule.model');

const getAll = async () => Model.find({}).select('-_id -__v').lean();
const getById = async (id) => Model.findOne({ id }).select('-_id -__v').lean();

const update = async (id, data) => {
  const existing = await Model.findOne({ id }).lean();
  if (!existing) return null;
  const updated = await Model.findOneAndUpdate({ id }, data, { new: true }).select('-_id -__v').lean();
  return updated;
};

module.exports = { getAll, getById, update };
`);

// 9. Verification Service
fs.writeFileSync(path.join(servicesDir, 'verification.service.js'), `
const Model = require('../models/verification.model');

const getAll = async () => Model.find({}).select('-_id -__v').lean();
const getById = async (id) => Model.findOne({ id }).select('-_id -__v').lean();

const update = async (id, data) => {
  const existing = await Model.findOne({ id }).lean();
  if (!existing) return null;
  const updated = await Model.findOneAndUpdate({ id }, data, { new: true }).select('-_id -__v').lean();
  return updated;
};

module.exports = { getAll, getById, update };
`);

// 10. Reports Data File (Acting as Service)
fs.writeFileSync(path.join(dataDir, 'reports.js'), `
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
`);

// 11. Settings Data File (Acting as Service)
fs.writeFileSync(path.join(dataDir, 'settings.js'), `
const Model = require('../models/settings.model');

// Return a generic settings object if the DB is unseeded
const defaultSettings = {
  hospitalName: "General Hospital",
  wardCount: 12,
  deviceCount: 45,
  alertThresholds: {
    criticalStock: 10,
    lowStock: 50,
  },
  dashboardRefreshInterval: 30, // seconds
  themePreference: "dark"
};

const getSettings = async () => {
  const settings = await Model.findOne({}).select('-_id -__v').lean();
  return settings || defaultSettings;
};

const updateSettings = async (updates) => {
  const existing = await Model.findOne({});
  if (!existing) {
    // If not exists, create with updates merged into defaults
    const newSettings = { ...defaultSettings, ...updates };
    const created = await Model.create(newSettings);
    const doc = created.toObject(); delete doc._id; delete doc.__v; return doc;
  }
  
  // Use _id for updates on singletons since they don't have a string id
  const updated = await Model.findByIdAndUpdate(existing._id, updates, { new: true }).select('-_id -__v').lean();
  return updated;
};

module.exports = { getSettings, updateSettings };
`);

console.log('Services 8-11 generated');
