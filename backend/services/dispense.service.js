
const Model = require('../models/dispenseJob.model');

const getAll = async () => Model.find({}).select('-_id -__v').lean();
const getById = async (id) => Model.findOne({ id }).select('-_id -__v').lean();

const update = async (id, data) => {
  const existing = await Model.findOne({ id }).lean();
  if (!existing) return { error: 'Dispense job not found' };
  const updated = await Model.findOneAndUpdate({ id }, data, { new: true }).select('-_id -__v').lean();
  return { data: updated };
};

module.exports = { getAll, getById, update };
