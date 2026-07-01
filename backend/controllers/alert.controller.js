const alertService = require('../services/alert.service');

<<<<<<< HEAD
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
=======
const getAlerts = (req, res) => {
  const { type, status } = req.query;
  const alerts = alertService.getAll({ type, status });
  res.json(alerts);
};

const getAlertById = (req, res) => {
  const alert = alertService.getById(req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  res.json(alert);
};

const createAlert = (req, res) => {
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
  const { type, desc, device } = req.body;
  if (!type || !desc || !device) {
    return res.status(400).json({ error: 'type, desc, device are required' });
  }
<<<<<<< HEAD
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
=======
  const created = alertService.create(req.body);
  res.status(201).json({ message: 'Alert created', data: created });
};

const resolveAlert = (req, res) => {
  const updated = alertService.resolve(req.params.id);
  if (!updated) return res.status(404).json({ error: 'Alert not found' });
  res.json({ message: 'Alert resolved', data: updated });
};

const deleteAlert = (req, res) => {
  const removed = alertService.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Alert not found' });
  res.json({ message: 'Alert deleted' });
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
};

module.exports = { getAlerts, getAlertById, createAlert, resolveAlert, deleteAlert };