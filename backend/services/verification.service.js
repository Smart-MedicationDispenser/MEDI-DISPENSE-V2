
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
