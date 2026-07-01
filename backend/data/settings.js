
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
