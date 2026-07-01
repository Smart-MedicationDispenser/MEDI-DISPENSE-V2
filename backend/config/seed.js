const mongoose = require('mongoose');

const Patient = require('../models/patient.model');
const Medication = require('../models/medication.model');
const Device = require('../models/device.model');
const Alert = require('../models/alert.model');
const Prescription = require('../models/prescription.model');
const Audit = require('../models/audit.model');
const DispenseJob = require('../models/dispenseJob.model');
const Report = require('../models/report.model');
const Schedule = require('../models/schedule.model');
const Verification = require('../models/verification.model');
const Settings = require('../models/settings.model');

// We have to bypass the 'store' exports and directly access the array.
// But wait, the data files export a 'store' object!
// Let's look at how they are exported.
// They all have `const store = { getAll: () => array, ... }`
// So we can just call `require('../data/xyz').getAll()` to get the array!

const initialReports = [
  { id: "REP-001", type: "Daily Activity", generatedAt: "2026-06-30T08:00:00Z", status: "Ready", format: "PDF" },
  { id: "REP-002", type: "Medication Usage", generatedAt: "2026-06-29T08:00:00Z", status: "Ready", format: "CSV" },
  { id: "REP-003", type: "Device Status", generatedAt: "2026-06-30T09:00:00Z", status: "Pending", format: "PDF" },
  { id: "REP-004", type: "Alert Summary", generatedAt: "2026-06-28T10:00:00Z", status: "Ready", format: "PDF" },
  { id: "REP-005", type: "Audit Summary", generatedAt: "2026-06-30T06:00:00Z", status: "Ready", format: "JSON" }
];

const initialSettings = {
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

const seedDatabase = async () => {
  try {
    const models = [
      { Model: Patient, data: require('../data/patients').getAll() },
      { Model: Medication, data: require('../data/medications').getAll() },
      { Model: Device, data: require('../data/devices').getAll() },
      { Model: Alert, data: require('../data/alerts').getAll() },
      { Model: Prescription, data: require('../data/prescriptions').getAll() },
      { Model: Audit, data: require('../data/audits').getAll() },
      { Model: DispenseJob, data: require('../data/dispense_jobs').getAll() },
      { Model: Report, data: initialReports },
      { Model: Schedule, data: require('../data/schedules').getAll() },
      { Model: Verification, data: require('../data/verifications').getAll() },
    ];

    for (const { Model, data } of models) {
      const count = await Model.countDocuments();
      if (count === 0 && data.length > 0) {
        await Model.insertMany(data);
        console.log(`✓ Seeded ${Model.modelName} collection with ${data.length} records.`);
      }
    }

    // Settings is a single object, not an array
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      await Settings.create(initialSettings);
      console.log(`✓ Seeded Settings collection.`);
    }

  } catch (error) {
    console.error('[FATAL] Database seeding failed:', error);
    throw error;
  }
};

module.exports = seedDatabase;
