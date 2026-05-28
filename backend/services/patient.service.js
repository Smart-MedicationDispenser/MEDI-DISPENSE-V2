const store = require('../data/patients');

const getAll = () => {
  return store.getAll();
};

const add = (patientData) => {
  const patients = store.getAll();

  const newPatient = {
    id: "P-" + String(patients.length + 1022).padStart(4, "0"),

    name: patientData.name || "Unknown",
    ward: patientData.ward || "N/A",
    medication: patientData.medication || "N/A",

    next: patientData.next || "No Schedule",
    status: patientData.status || "Active",
  };

  return store.add(newPatient);
};

const remove = (id) => {
  store.remove(id);
};

module.exports = { getAll, add, remove };