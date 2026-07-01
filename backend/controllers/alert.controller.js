const alertService = require('../services/alert.service');

const getAlerts = async (req, res, next) => {
  try {
  const { type, status } = req.query;
  const alerts = await alertService.getAll({ type, status });
  res.json(alerts);
  } catch (err) {
    next(err);
  }
};

const getAlertById = async (req, res, next) => {
  try {
  const alert = await alertService.getById(req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  res.json(alert);
  } catch (err) {
    next(err);
  }
};

const createAlert = async (req, res, next) => {
  try {
  const { type, desc, device } = req.body;
  if (!type || !desc || !device) {
    return res.status(400).json({ error: 'type, desc, device are required' });
  }
  const created = await alertService.create(req.body);
  res.status(201).json({ message: 'Alert created', data: created });
  } catch (err) {
    next(err);
  }
};

const resolveAlert = async (req, res, next) => {
  try {
  const updated = await alertService.resolve(req.params.id);
  if (!updated) return res.status(404).json({ error: 'Alert not found' });
  res.json({ message: 'Alert resolved', data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteAlert = async (req, res, next) => {
  try {
  const removed = await alertService.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Alert not found' });
  res.json({ message: 'Alert deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAlerts, getAlertById, createAlert, resolveAlert, deleteAlert };