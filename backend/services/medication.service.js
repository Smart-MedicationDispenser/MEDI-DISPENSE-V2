const store = require('../data/medications');

// Mirrors getMedicationStatus() in Medications.jsx
// Critical  → stock <= floor(threshold / 2)
// Low Stock → stock <= threshold
// OK        → everything else
const deriveStatus = (stock, threshold) => {
  const s = Number(stock);
  const t = Number(threshold);
  if (s <= Math.floor(t / 2)) return 'Critical';
  if (s <= t) return 'Low Stock';
  return 'OK';
};

const getAll = () => {
  return store.getAll();
};

const getById = (id) => {
  return store.getById(id);
};

const add = (data) => {
  const stock     = Number(data.stock);
  const threshold = Number(data.threshold);
  const med = {
    id:        'MED-' + Date.now(),
    name:      data.name,
    dosage:    data.dosage,
    stock,
    threshold,
    expiry:    data.expiry || null,
    status:    deriveStatus(stock, threshold)
  };
  return store.add(med);
};

const update = (id, data) => {
  const existing = store.getById(id);
  if (!existing) return null;

  const stock     = data.stock     !== undefined ? Number(data.stock)     : existing.stock;
  const threshold = data.threshold !== undefined ? Number(data.threshold) : existing.threshold;

  const updates = {
    ...(data.name      !== undefined && { name:      data.name }),
    ...(data.dosage    !== undefined && { dosage:    data.dosage }),
    ...(data.expiry    !== undefined && { expiry:    data.expiry }),
    stock,
    threshold,
    status: deriveStatus(stock, threshold)
  };

  return store.update(id, updates);
};

const remove = (id) => {
  return store.remove(id);
};

module.exports = { getAll, getById, add, update, remove };