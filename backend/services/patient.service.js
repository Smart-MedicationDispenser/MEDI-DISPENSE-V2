const store = require('../data/patients');

const getAll = () => {
  return store.getAll();
};

const add = (patientData) => {
  return store.add(patientData);
};

const remove = (id) => {
  store.remove(id);
};

module.exports = { getAll, add, remove };