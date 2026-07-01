
const Model = require('../models/audit.model');

async function logAction(actionType, moduleName, userId = "System", result = "Success") {
  const entry = {
    id: 'A-' + Date.now().toString().slice(-4),
    timestamp: new Date().toISOString(),
    user: userId,
    module: moduleName,
    action: actionType,
    result: result
  };
  await Model.create(entry);
  
  // Maintain max 500 documents (simulating array bounds, optional but nice)
  const count = await Model.countDocuments();
  if (count > 500) {
    const oldest = await Model.find().sort({ timestamp: 1 }).limit(count - 500).lean();
    for (const doc of oldest) await Model.findByIdAndDelete(doc._id);
  }
  return true;
}

async function getAuditTrail(queryOptions = {}) {
  // Sort descending by timestamp like the original unshift behavior
  return Model.find({}).sort({ timestamp: -1 }).select('-_id -__v').lean();
}

module.exports = { logAction, getAuditTrail };
