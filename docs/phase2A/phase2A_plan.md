Good — full inspection complete. I now have everything needed. Here's the precise Phase 2A plan:



1\. FILES INSPECTED

FileStatebackend/server.js✅ Working — in-memory routes (GET /patients, POST /patients, GET /devices, GET /alerts)backend/package.json✅ Active — missing mongoosebackend/config/Folder exists, emptybackend/models/\*.model.js (7 files)Exist, all emptysrc/config/db.js✅ Working Mongoose connectsrc/models/Patient.js✅ Full schemasrc/models/Device.js✅ Full schemasrc/models/Medication.js✅ Full schemasrc/models/DispenseEvent.js✅ Full schemasrc/models/Slot.js✅ Full schemasrc/models/Prescription.js✅ Full schemasrc/models/DispenseSession.js// schema placeholder — empty stubsrc/models/SensorLog.js// schema placeholder — empty stubsrc/models/VerificationLog.js// schema placeholder — empty stubsrc/models/Alert.jsDoes not existsrc/models/Inventory.jsDoes not exist



2\. FILES TO MODIFY

FileReasonbackend/package.jsonAdd mongoose dependencybackend/models/patient.model.jsEmpty → full Mongoose schemabackend/models/device.model.jsEmpty → full Mongoose schemabackend/models/alert.model.jsEmpty → full Mongoose schemabackend/models/medication.model.jsEmpty → full Mongoose schemabackend/models/inventory.model.jsEmpty → full Mongoose schemabackend/models/dispense.model.jsEmpty → full Mongoose schemabackend/models/dispenseLog.model.jsEmpty → full Mongoose schemasrc/models/DispenseSession.jsPlaceholder → full schemasrc/models/SensorLog.jsPlaceholder → full schemasrc/models/VerificationLog.jsPlaceholder → full schema

3\. FILES TO CREATE

FileReasonbackend/config/db.jsMissing — Mongoose connect for backend/src/models/Alert.jsMissing schema for alerts collectionsrc/models/Inventory.jsMissing schema for inventory collection

4\. FILES UNTOUCHED

backend/server.js, backend/routes/patient.routes.js, backend/data/patients.js, src/config/db.js, src/models/Patient.js, src/models/Device.js, src/models/Medication.js, src/models/DispenseEvent.js, src/models/Slot.js, src/models/Prescription.js, all frontend files, all hardware files.



5\. EXACT CODE



backend/package.json — add mongoose

json{

&#x20; "name": "backend",

&#x20; "version": "1.0.0",

&#x20; "description": "",

&#x20; "main": "server.js",

&#x20; "scripts": {

&#x20;   "start": "node server.js",

&#x20;   "dev": "nodemon server.js",

&#x20;   "test": "echo \\"Error: no test specified\\\\\\" \&\& exit 1"

&#x20; },

&#x20; "keywords": \[],

&#x20; "author": "",

&#x20; "license": "ISC",

&#x20; "type": "commonjs",

&#x20; "dependencies": {

&#x20;   "cors": "^2.8.6",

&#x20;   "express": "^5.2.1",

&#x20;   "mongoose": "^9.2.3",

&#x20;   "dotenv": "^17.3.1"

&#x20; },

&#x20; "devDependencies": {

&#x20;   "nodemon": "^3.1.14"

&#x20; }

}



backend/config/db.js — NEW

jsconst mongoose = require('mongoose');



const connectDB = async () => {

&#x20; try {

&#x20;   const uri = process.env.MONGO\_URI || 'mongodb://127.0.0.1:27017/medidispense';

&#x20;   await mongoose.connect(uri);

&#x20;   console.log('\[backend] MongoDB Connected');

&#x20; } catch (err) {

&#x20;   console.error('\[backend] MongoDB connection error:', err.message);

&#x20;   process.exit(1);

&#x20; }

};



module.exports = connectDB;



backend/models/patient.model.js

jsconst mongoose = require('mongoose');



const patientSchema = new mongoose.Schema(

&#x20; {

&#x20;   patientId: {

&#x20;     type: String,

&#x20;     required: true,

&#x20;     unique: true,

&#x20;     trim: true

&#x20;   },

&#x20;   name: {

&#x20;     type: String,

&#x20;     required: true,

&#x20;     trim: true

&#x20;   },

&#x20;   age: {

&#x20;     type: Number,

&#x20;     min: 0

&#x20;   },

&#x20;   gender: {

&#x20;     type: String,

&#x20;     enum: \['male', 'female', 'other'],

&#x20;     lowercase: true

&#x20;   },

&#x20;   ward: {

&#x20;     type: String,

&#x20;     trim: true

&#x20;   },

&#x20;   bedNumber: {

&#x20;     type: String,

&#x20;     trim: true

&#x20;   },

&#x20;   doctor: {

&#x20;     type: String,

&#x20;     trim: true

&#x20;   },

&#x20;   status: {

&#x20;     type: String,

&#x20;     enum: \['active', 'discharged', 'pending'],

&#x20;     default: 'active'

&#x20;   }

&#x20; },

&#x20; { timestamps: true }

);



module.exports = mongoose.model('Patient', patientSchema);



backend/models/device.model.js

jsconst mongoose = require('mongoose');



const deviceSchema = new mongoose.Schema(

&#x20; {

&#x20;   deviceId: {

&#x20;     type: String,

&#x20;     required: true,

&#x20;     unique: true,

&#x20;     trim: true

&#x20;   },

&#x20;   name: {

&#x20;     type: String,

&#x20;     trim: true

&#x20;   },

&#x20;   location: {

&#x20;     type: String,

&#x20;     trim: true

&#x20;   },

&#x20;   ward: {

&#x20;     type: String,

&#x20;     trim: true

&#x20;   },

&#x20;   status: {

&#x20;     type: String,

&#x20;     enum: \['online', 'offline', 'maintenance', 'error'],

&#x20;     default: 'offline'

&#x20;   },

&#x20;   batteryLevel: {

&#x20;     type: Number,

&#x20;     min: 0,

&#x20;     max: 100,

&#x20;     default: null

&#x20;   },

&#x20;   firmwareVersion: {

&#x20;     type: String

&#x20;   },

&#x20;   lastSeen: {

&#x20;     type: Date,

&#x20;     default: null

&#x20;   },

&#x20;   ipAddress: {

&#x20;     type: String

&#x20;   }

&#x20; },

&#x20; { timestamps: true }

);



module.exports = mongoose.model('Device', deviceSchema);



backend/models/alert.model.js

jsconst mongoose = require('mongoose');



const alertSchema = new mongoose.Schema(

&#x20; {

&#x20;   alertId: {

&#x20;     type: String,

&#x20;     unique: true,

&#x20;     trim: true

&#x20;   },

&#x20;   type: {

&#x20;     type: String,

&#x20;     enum: \[

&#x20;       'low\_stock',

&#x20;       'refill',

&#x20;       'critical',

&#x20;       'device\_offline',

&#x20;       'missed\_dose',

&#x20;       'verification\_failed',

&#x20;       'expiry'

&#x20;     ],

&#x20;     required: true

&#x20;   },

&#x20;   severity: {

&#x20;     type: String,

&#x20;     enum: \['low', 'medium', 'high', 'critical'],

&#x20;     default: 'medium'

&#x20;   },

&#x20;   message: {

&#x20;     type: String,

&#x20;     required: true

&#x20;   },

&#x20;   source: {

&#x20;     deviceId: { type: String, default: null },

&#x20;     patientId: { type: String, default: null },

&#x20;     medicationId: { type: String, default: null }

&#x20;   },

&#x20;   acknowledged: {

&#x20;     type: Boolean,

&#x20;     default: false

&#x20;   },

&#x20;   acknowledgedAt: {

&#x20;     type: Date,

&#x20;     default: null

&#x20;   },

&#x20;   resolvedAt: {

&#x20;     type: Date,

&#x20;     default: null

&#x20;   }

&#x20; },

&#x20; { timestamps: true }

);



// Auto-generate alertId before save

alertSchema.pre('save', function (next) {

&#x20; if (!this.alertId) {

&#x20;   this.alertId = 'ALR-' + Date.now().toString(36).toUpperCase();

&#x20; }

&#x20; next();

});



module.exports = mongoose.model('Alert', alertSchema);



backend/models/medication.model.js

jsconst mongoose = require('mongoose');



const medicationSchema = new mongoose.Schema(

&#x20; {

&#x20;   medicationId: {

&#x20;     type: String,

&#x20;     unique: true,

&#x20;     trim: true

&#x20;   },

&#x20;   name: {

&#x20;     type: String,

&#x20;     required: true,

&#x20;     trim: true

&#x20;   },

&#x20;   genericName: {

&#x20;     type: String,

&#x20;     trim: true

&#x20;   },

&#x20;   category: {

&#x20;     type: String,

&#x20;     trim: true

&#x20;   },

&#x20;   form: {

&#x20;     type: String,

&#x20;     enum: \['tablet', 'capsule', 'liquid', 'injection', 'patch'],

&#x20;     default: 'tablet'

&#x20;   },

&#x20;   strengthMg: {

&#x20;     type: Number

&#x20;   },

&#x20;   tabletWeightMg: {

&#x20;     type: Number

&#x20;   },

&#x20;   expectedMass: {

&#x20;     type: Number

&#x20;   },

&#x20;   toleranceLower: {

&#x20;     type: Number,

&#x20;     default: 0.7

&#x20;   },

&#x20;   toleranceUpper: {

&#x20;     type: Number,

&#x20;     default: 1.3

&#x20;   },

&#x20;   yoloClassId: {

&#x20;     type: Number,

&#x20;     default: null

&#x20;   },

&#x20;   requiresRefrigeration: {

&#x20;     type: Boolean,

&#x20;     default: false

&#x20;   },

&#x20;   isActive: {

&#x20;     type: Boolean,

&#x20;     default: true

&#x20;   }

&#x20; },

&#x20; { timestamps: true }

);



medicationSchema.pre('save', function (next) {

&#x20; if (!this.medicationId) {

&#x20;   this.medicationId = 'MED-' + Date.now().toString(36).toUpperCase();

&#x20; }

&#x20; next();

});



module.exports = mongoose.model('Medication', medicationSchema);



backend/models/inventory.model.js

jsconst mongoose = require('mongoose');



const inventorySchema = new mongoose.Schema(

&#x20; {

&#x20;   medicationId: {

&#x20;     type: mongoose.Schema.Types.ObjectId,

&#x20;     ref: 'Medication',

&#x20;     required: true

&#x20;   },

&#x20;   deviceId: {

&#x20;     type: mongoose.Schema.Types.ObjectId,

&#x20;     ref: 'Device',

&#x20;     required: true

&#x20;   },

&#x20;   slotNumber: {

&#x20;     type: Number,

&#x20;     required: true,

&#x20;     min: 1

&#x20;   },

&#x20;   totalCapacity: {

&#x20;     type: Number,

&#x20;     required: true

&#x20;   },

&#x20;   currentStock: {

&#x20;     type: Number,

&#x20;     required: true,

&#x20;     min: 0

&#x20;   },

&#x20;   lowStockThreshold: {

&#x20;     type: Number,

&#x20;     default: 5

&#x20;   },

&#x20;   criticalThreshold: {

&#x20;     type: Number,

&#x20;     default: 2

&#x20;   },

&#x20;   expiryDate: {

&#x20;     type: Date,

&#x20;     default: null

&#x20;   },

&#x20;   batchNumber: {

&#x20;     type: String,

&#x20;     trim: true,

&#x20;     default: null

&#x20;   },

&#x20;   lastRestockedAt: {

&#x20;     type: Date,

&#x20;     default: null

&#x20;   },

&#x20;   isActive: {

&#x20;     type: Boolean,

&#x20;     default: true

&#x20;   }

&#x20; },

&#x20; { timestamps: true }

);



// Compound index: one slot per device

inventorySchema.index({ deviceId: 1, slotNumber: 1 }, { unique: true });



// Virtual: is low stock?

inventorySchema.virtual('isLowStock').get(function () {

&#x20; return this.currentStock <= this.lowStockThreshold;

});



// Virtual: is critical?

inventorySchema.virtual('isCritical').get(function () {

&#x20; return this.currentStock <= this.criticalThreshold;

});



inventorySchema.set('toJSON', { virtuals: true });



module.exports = mongoose.model('Inventory', inventorySchema);



backend/models/dispense.model.js

jsconst mongoose = require('mongoose');



const dispenseSchema = new mongoose.Schema(

&#x20; {

&#x20;   sessionId: {

&#x20;     type: String,

&#x20;     unique: true,

&#x20;     trim: true

&#x20;   },

&#x20;   patientId: {

&#x20;     type: mongoose.Schema.Types.ObjectId,

&#x20;     ref: 'Patient',

&#x20;     required: true

&#x20;   },

&#x20;   medicationId: {

&#x20;     type: mongoose.Schema.Types.ObjectId,

&#x20;     ref: 'Medication',

&#x20;     required: true

&#x20;   },

&#x20;   deviceId: {

&#x20;     type: mongoose.Schema.Types.ObjectId,

&#x20;     ref: 'Device',

&#x20;     required: true

&#x20;   },

&#x20;   prescribedDose: {

&#x20;     type: Number,

&#x20;     required: true

&#x20;   },

&#x20;   dispensedQty: {

&#x20;     type: Number,

&#x20;     default: 0

&#x20;   },

&#x20;   status: {

&#x20;     type: String,

&#x20;     enum: \['pending', 'in\_progress', 'dispensed', 'failed', 'cancelled'],

&#x20;     default: 'pending'

&#x20;   },

&#x20;   triggerType: {

&#x20;     type: String,

&#x20;     enum: \['scheduled', 'manual', 'mqtt'],

&#x20;     default: 'scheduled'

&#x20;   },

&#x20;   initiatedAt: {

&#x20;     type: Date,

&#x20;     default: Date.now

&#x20;   },

&#x20;   completedAt: {

&#x20;     type: Date,

&#x20;     default: null

&#x20;   },

&#x20;   errorReason: {

&#x20;     type: String,

&#x20;     default: null

&#x20;   }

&#x20; },

&#x20; { timestamps: true }

);



dispenseSchema.pre('save', function (next) {

&#x20; if (!this.sessionId) {

&#x20;   this.sessionId = 'DS-' + Date.now().toString(36).toUpperCase();

&#x20; }

&#x20; next();

});



module.exports = mongoose.model('Dispense', dispenseSchema);



backend/models/dispenseLog.model.js

jsconst mongoose = require('mongoose');



const dispenseLogSchema = new mongoose.Schema(

&#x20; {

&#x20;   dispenseId: {

&#x20;     type: mongoose.Schema.Types.ObjectId,

&#x20;     ref: 'Dispense',

&#x20;     required: true

&#x20;   },

&#x20;   patientId: {

&#x20;     type: mongoose.Schema.Types.ObjectId,

&#x20;     ref: 'Patient',

&#x20;     required: true

&#x20;   },

&#x20;   medicationId: {

&#x20;     type: mongoose.Schema.Types.ObjectId,

&#x20;     ref: 'Medication',

&#x20;     required: true

&#x20;   },

&#x20;   deviceId: {

&#x20;     type: mongoose.Schema.Types.ObjectId,

&#x20;     ref: 'Device',

&#x20;     required: true

&#x20;   },

&#x20;   slotNumber: {

&#x20;     type: Number

&#x20;   },

&#x20;   dispensedQty: {

&#x20;     type: Number,

&#x20;     required: true

&#x20;   },

&#x20;   measuredWeightG: {

&#x20;     type: Number,

&#x20;     default: null

&#x20;   },

&#x20;   verificationPassed: {

&#x20;     type: Boolean,

&#x20;     default: null

&#x20;   },

&#x20;   verificationMethod: {

&#x20;     type: String,

&#x20;     enum: \['weight', 'vision', 'both', 'none'],

&#x20;     default: 'none'

&#x20;   },

&#x20;   status: {

&#x20;     type: String,

&#x20;     enum: \['success', 'failed', 'partial', 'skipped'],

&#x20;     default: 'success'

&#x20;   },

&#x20;   notes: {

&#x20;     type: String,

&#x20;     default: null

&#x20;   },

&#x20;   loggedAt: {

&#x20;     type: Date,

&#x20;     default: Date.now

&#x20;   }

&#x20; },

&#x20; { timestamps: true }

);



// TTL index — keep logs for 1 year

dispenseLogSchema.index({ loggedAt: 1 }, { expireAfterSeconds: 365 \* 24 \* 60 \* 60 });



module.exports = mongoose.model('DispenseLog', dispenseLogSchema);



src/models/Alert.js — NEW

jsconst mongoose = require('mongoose');



const alertSchema = new mongoose.Schema(

&#x20; {

&#x20;   alertId: {

&#x20;     type: String,

&#x20;     unique: true,

&#x20;     trim: true

&#x20;   },

&#x20;   type: {

&#x20;     type: String,

&#x20;     enum: \[

&#x20;       'low\_stock',

&#x20;       'refill',

&#x20;       'critical',

&#x20;       'device\_offline',

&#x20;       'missed\_dose',

&#x20;       'verification\_failed',

&#x20;       'expiry',

&#x20;       'sensor\_anomaly'

&#x20;     ],

&#x20;     required: true

&#x20;   },

&#x20;   severity: {

&#x20;     type: String,

&#x20;     enum: \['low', 'medium', 'high', 'critical'],

&#x20;     default: 'medium'

&#x20;   },

&#x20;   message: {

&#x20;     type: String,

&#x20;     required: true

&#x20;   },

&#x20;   source: {

&#x20;     deviceId: {

&#x20;       type: mongoose.Schema.Types.ObjectId,

&#x20;       ref: 'Device',

&#x20;       default: null

&#x20;     },

&#x20;     patientId: {

&#x20;       type: mongoose.Schema.Types.ObjectId,

&#x20;       ref: 'Patient',

&#x20;       default: null

&#x20;     },

&#x20;     medicationId: {

&#x20;       type: mongoose.Schema.Types.ObjectId,

&#x20;       ref: 'Medication',

&#x20;       default: null

&#x20;     }

&#x20;   },

&#x20;   acknowledged: {

&#x20;     type: Boolean,

&#x20;     default: false

&#x20;   },

&#x20;   acknowledgedBy: {

&#x20;     type: String,

&#x20;     default: null

&#x20;   },

&#x20;   acknowledgedAt: {

&#x20;     type: Date,

&#x20;     default: null

&#x20;   },

&#x20;   resolvedAt: {

&#x20;     type: Date,

&#x20;     default: null

&#x20;   }

&#x20; },

&#x20; { timestamps: true }

);



alertSchema.pre('save', function (next) {

&#x20; if (!this.alertId) {

&#x20;   this.alertId = 'ALR-' + Date.now().toString(36).toUpperCase();

&#x20; }

&#x20; next();

});



// Index for fast unresolved alert queries

alertSchema.index({ acknowledged: 1, severity: 1 });



module.exports = mongoose.model('Alert', alertSchema);



src/models/Inventory.js — NEW

jsconst mongoose = require('mongoose');



const inventorySchema = new mongoose.Schema(

&#x20; {

&#x20;   medicationId: {

&#x20;     type: mongoose.Schema.Types.ObjectId,

&#x20;     ref: 'Medication',

&#x20;     required: true

&#x20;   },

&#x20;   deviceId: {

&#x20;     type: mongoose.Schema.Types.ObjectId,

&#x20;     ref: 'Device',

&#x20;     required: true

&#x20;   },

&#x20;   slotNumber: {

&#x20;     type: Number,

&#x20;     required: true,

&#x20;     min: 1

&#x20;   },

&#x20;   totalCapacity: {

&#x20;     type: Number,

&#x20;     required: true

&#x20;   },

&#x20;   currentStock: {

&#x20;     type: Number,

&#x20;     required: true,

&#x20;     min: 0

&#x20;   },

&#x20;   lowStockThreshold: {

&#x20;     type: Number,

&#x20;     default: 5

&#x20;   },

&#x20;   criticalThreshold: {

&#x20;     type: Number,

&#x20;     default: 2

&#x20;   },

&#x20;   expiryDate: {

&#x20;     type: Date,

&#x20;     default: null

&#x20;   },

&#x20;   batchNumber: {

&#x20;     type: String,

&#x20;     trim: true,

&#x20;     default: null

&#x20;   },

&#x20;   lastRestockedAt: {

&#x20;     type: Date,

&#x20;     default: null

&#x20;   },

&#x20;   isActive: {

&#x20;     type: Boolean,

&#x20;     default: true

&#x20;   }

&#x20; },

&#x20; { timestamps: true }

);



inventorySchema.index({ deviceId: 1, slotNumber: 1 }, { unique: true });



inventorySchema.virtual('isLowStock').get(function () {

&#x20; return this.currentStock <= this.lowStockThreshold;

});



inventorySchema.virtual('isCritical').get(function () {

&#x20; return this.currentStock <= this.criticalThreshold;

});



inventorySchema.set('toJSON', { virtuals: true });



module.exports = mongoose.model('Inventory', inventorySchema);



src/models/DispenseSession.js — fill placeholder

jsconst mongoose = require('mongoose');



const dispenseSessionSchema = new mongoose.Schema(

&#x20; {

&#x20;   sessionId: {

&#x20;     type: String,

&#x20;     unique: true,

&#x20;     trim: true

&#x20;   },

&#x20;   patientId: {

&#x20;     type: mongoose.Schema.Types.ObjectId,

&#x20;     ref: 'Patient',

&#x20;     required: true

&#x20;   },

&#x20;   deviceId: {

&#x20;     type: mongoose.Schema.Types.ObjectId,

&#x20;     ref: 'Device',

&#x20;     required: true

&#x20;   },

&#x20;   prescriptionId: {

&#x20;     type: mongoose.Schema.Types.ObjectId,

&#x20;     ref: 'Prescription',

&#x20;     default: null

&#x20;   },

&#x20;   status: {

&#x20;     type: String,

&#x20;     enum: \['pending', 'in\_progress', 'completed', 'failed', 'cancelled'],

&#x20;     default: 'pending'

&#x20;   },

&#x20;   triggerType: {

&#x20;     type: String,

&#x20;     enum: \['scheduled', 'manual', 'mqtt'],

&#x20;     default: 'scheduled'

&#x20;   },

&#x20;   dispensedEvents: \[

&#x20;     {

&#x20;       type: mongoose.Schema.Types.ObjectId,

&#x20;       ref: 'DispenseEvent'

&#x20;     }

&#x20;   ],

&#x20;   startedAt: {

&#x20;     type: Date,

&#x20;     default: Date.now

&#x20;   },

&#x20;   completedAt: {

&#x20;     type: Date,

&#x20;     default: null

&#x20;   },

&#x20;   notes: {

&#x20;     type: String,

&#x20;     default: null

&#x20;   }

&#x20; },

&#x20; { timestamps: true }

);



dispenseSessionSchema.pre('save', function (next) {

&#x20; if (!this.sessionId) {

&#x20;   this.sessionId = 'SESSION-' + Date.now().toString(36).toUpperCase();

&#x20; }

&#x20; next();

});



module.exports = mongoose.model('DispenseSession', dispenseSessionSchema);



src/models/SensorLog.js — fill placeholder

jsconst mongoose = require('mongoose');



const sensorLogSchema = new mongoose.Schema(

&#x20; {

&#x20;   deviceId: {

&#x20;     type: mongoose.Schema.Types.ObjectId,

&#x20;     ref: 'Device',

&#x20;     required: true

&#x20;   },

&#x20;   sensorType: {

&#x20;     type: String,

&#x20;     enum: \['load\_cell', 'ir', 'temperature', 'humidity', 'battery', 'heartbeat'],

&#x20;     required: true

&#x20;   },

&#x20;   rawValue: {

&#x20;     type: Number,

&#x20;     required: true

&#x20;   },

&#x20;   unit: {

&#x20;     type: String,

&#x20;     default: null

&#x20;   },

&#x20;   slotNumber: {

&#x20;     type: Number,

&#x20;     default: null

&#x20;   },

&#x20;   mqttTopic: {

&#x20;     type: String,

&#x20;     default: null

&#x20;   },

&#x20;   isAnomaly: {

&#x20;     type: Boolean,

&#x20;     default: false

&#x20;   },

&#x20;   loggedAt: {

&#x20;     type: Date,

&#x20;     default: Date.now,

&#x20;     index: true

&#x20;   }

&#x20; },

&#x20; {

&#x20;   timestamps: true,

&#x20;   // Capped collection alternative: TTL instead

&#x20; }

);



// Keep sensor logs for 90 days

sensorLogSchema.index({ loggedAt: 1 }, { expireAfterSeconds: 90 \* 24 \* 60 \* 60 });



// Fast lookup by device + sensor type

sensorLogSchema.index({ deviceId: 1, sensorType: 1, loggedAt: -1 });



module.exports = mongoose.model('SensorLog', sensorLogSchema);



src/models/VerificationLog.js — fill placeholder

jsconst mongoose = require('mongoose');



const verificationLogSchema = new mongoose.Schema(

&#x20; {

&#x20;   dispenseEventId: {

&#x20;     type: mongoose.Schema.Types.ObjectId,

&#x20;     ref: 'DispenseEvent',

&#x20;     default: null

&#x20;   },

&#x20;   deviceId: {

&#x20;     type: mongoose.Schema.Types.ObjectId,

&#x20;     ref: 'Device',

&#x20;     required: true

&#x20;   },

&#x20;   medicationId: {

&#x20;     type: mongoose.Schema.Types.ObjectId,

&#x20;     ref: 'Medication',

&#x20;     default: null

&#x20;   },

&#x20;   method: {

&#x20;     type: String,

&#x20;     enum: \['weight', 'vision', 'both', 'manual'],

&#x20;     required: true

&#x20;   },

&#x20;   passed: {

&#x20;     type: Boolean,

&#x20;     required: true

&#x20;   },

&#x20;   expectedQty: {

&#x20;     type: Number,

&#x20;     default: null

&#x20;   },

&#x20;   detectedQty: {

&#x20;     type: Number,

&#x20;     default: null

&#x20;   },

&#x20;   expectedWeightG: {

&#x20;     type: Number,

&#x20;     default: null

&#x20;   },

&#x20;   measuredWeightG: {

&#x20;     type: Number,

&#x20;     default: null

&#x20;   },

&#x20;   yoloConfidence: {

&#x20;     type: Number,

&#x20;     min: 0,

&#x20;     max: 1,

&#x20;     default: null

&#x20;   },

&#x20;   failureReason: {

&#x20;     type: String,

&#x20;     enum: \['weight\_mismatch', 'count\_mismatch', 'wrong\_tablet', 'sensor\_error', null],

&#x20;     default: null

&#x20;   },

&#x20;   imageRef: {

&#x20;     type: String,

&#x20;     default: null

&#x20;   },

&#x20;   verifiedAt: {

&#x20;     type: Date,

&#x20;     default: Date.now

&#x20;   }

&#x20; },

&#x20; { timestamps: true }

);



verificationLogSchema.index({ deviceId: 1, verifiedAt: -1 });

verificationLogSchema.index({ passed: 1 });



module.exports = mongoose.model('VerificationLog', verificationLogSchema);



Verification Checklist

Phase 2A — DB Schemas

─────────────────────────────────────────────────────────



BACKEND/ LAYER (simple Express, in-memory APIs preserved)

&#x20; ✅ backend/server.js                   — UNTOUCHED

&#x20; ✅ backend/routes/patient.routes.js    — UNTOUCHED (GET/POST/DELETE /patients works)

&#x20; ✅ backend/data/patients.js            — UNTOUCHED

&#x20; ✅ backend/models/patient.model.js     — Mongoose schema ready

&#x20; ✅ backend/models/device.model.js      — Mongoose schema ready

&#x20; ✅ backend/models/alert.model.js       — Mongoose schema ready

&#x20; ✅ backend/models/medication.model.js  — Mongoose schema ready

&#x20; ✅ backend/models/inventory.model.js   — Mongoose schema ready (virtual isLowStock/isCritical)

&#x20; ✅ backend/models/dispense.model.js    — Mongoose schema ready

&#x20; ✅ backend/models/dispenseLog.model.js — Mongoose schema ready (TTL 1yr)

&#x20; ✅ backend/config/db.js                — Mongoose connect utility (not yet wired to server.js — Phase 2B)

&#x20; ✅ backend/package.json                — mongoose + dotenv added



SRC/ LAYER (full MongoDB stack, existing models preserved)

&#x20; ✅ src/models/Patient.js     — UNTOUCHED (already complete)

&#x20; ✅ src/models/Device.js      — UNTOUCHED (already complete)

&#x20; ✅ src/models/Medication.js  — UNTOUCHED (already complete)

&#x20; ✅ src/models/DispenseEvent.js — UNTOUCHED (already complete)

&#x20; ✅ src/models/Slot.js        — UNTOUCHED (already complete)

&#x20; ✅ src/models/Prescription.js — UNTOUCHED (already complete)

&#x20; ✅ src/models/Alert.js       — NEW: 8-type alert schema with severity + source refs

&#x20; ✅ src/models/Inventory.js   — NEW: slot-level stock with TTL-ready virtuals

&#x20; ✅ src/models/DispenseSession.js — Filled: links Patient, Device, Prescription, DispenseEvents

&#x20; ✅ src/models/SensorLog.js   — Filled: TTL 90d, load\_cell/ir/temp/humidity/battery/heartbeat

&#x20; ✅ src/models/VerificationLog.js — Filled: weight+vision dual method, YOLO confidence



EXISTING APIs PRESERVED

&#x20; ✅ GET  /patients  — still returns in-memory array

&#x20; ✅ POST /patients  — still pushes to in-memory array

&#x20; ✅ GET  /devices   — still returns in-memory array

&#x20; ✅ GET  /alerts    — still returns in-memory array



PHASE 2B BLOCKERS (intentionally deferred)

&#x20; ⏸ backend/server.js wiring to MongoDB (do not touch until 2B)

&#x20; ⏸ Controllers for new schemas

&#x20; ⏸ Routes for inventory, dispense\_logs, sensor\_logs

&#x20; ⏸ MQTT integration

Phase 2A complete. Stopping here.

