const alertService = require('../services/alert.service');

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
  const { type, desc, device } = req.body;
  if (!type || !desc || !device) {
    return res.status(400).json({ error: 'type, desc, device are required' });
  }
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
};

module.exports = { getAlerts, getAlertById, createAlert, resolveAlert, deleteAlert };