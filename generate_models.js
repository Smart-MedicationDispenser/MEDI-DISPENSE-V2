const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'backend', 'models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir);
}

const schemas = {
  patient: `id: { type: String, required: true, unique: true },
  name: String,
  ward: String,
  medication: String,
  next: String,
  status: String`,
  
  medication: `id: { type: String, required: true, unique: true },
  name: String,
  dosage: String,
  stock: Number,
  threshold: Number,
  expiry: String,
  status: String`,
  
  device: `id: { type: String, required: true, unique: true },
  ward: String,
  room: String,
  status: String,
  battery: Number,
  slotsUsed: Number,
  slotsTotal: Number,
  lastHeartbeat: String`,
  
  alert: `id: { type: String, required: true, unique: true },
  type: String,
  patient: String,
  device: String,
  ward: String,
  desc: String,
  time: String,
  status: String`,
  
  prescription: `id: { type: String, required: true, unique: true },
  patientId: String,
  patientName: String,
  medication: String,
  dosage: String,
  frequency: String,
  startDate: String,
  endDate: String,
  doctor: String,
  status: String`,
  
  audit: `id: { type: String, required: true, unique: true },
  timestamp: String,
  user: String,
  module: String,
  action: String,
  result: String`,
  
  dispenseJob: `id: { type: String, required: true, unique: true },
  patient: String,
  medication: String,
  device: String,
  ward: String,
  time: String,
  status: String`,
  
  report: `id: { type: String, required: true, unique: true },
  type: String,
  generatedAt: String,
  status: String,
  format: String`,
  
  schedule: `id: { type: String, required: true, unique: true },
  patient: String,
  prescriptionId: String,
  medication: String,
  deviceId: String,
  time: String,
  status: String`,
  
  verification: `id: { type: String, required: true, unique: true },
  patient: String,
  medication: String,
  deviceId: String,
  scheduledTime: String,
  status: String,
  priority: String`,
  
  settings: `hospitalName: String,
  wardCount: Number,
  deviceCount: Number,
  alertThresholds: {
    criticalStock: Number,
    lowStock: Number
  },
  dashboardRefreshInterval: Number,
  themePreference: String`
};

for (const [name, schemaStr] of Object.entries(schemas)) {
  const modelName = name.charAt(0).toUpperCase() + name.slice(1);
  const content = `const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  ${schemaStr}
});

module.exports = mongoose.model('${modelName}', schema);
`;
  fs.writeFileSync(path.join(modelsDir, `${name}.model.js`), content);
}

console.log('Models created successfully.');
