let prescriptions = [
  {
    id: "RX-1001",
    patientId: "P-1021",
    patientName: "Ahmad Faris",
    medication: "Metformin 500mg",
    dosage: "1 Tablet",
    frequency: "Twice daily",
    startDate: "2026-06-01",
    endDate: "2026-12-01",
    doctor: "Dr. Smith",
    status: "Active"
  }
];

const store = {
  getAll: () => prescriptions,
  
  getById: (id) => prescriptions.find(p => p.id === id) || null,

  add: (prescription) => {
    prescriptions.push(prescription);
    return prescription;
  },

  update: (id, fields) => {
    const index = prescriptions.findIndex(p => p.id === id);
    if (index === -1) return null;
    prescriptions[index] = { ...prescriptions[index], ...fields };
    return prescriptions[index];
  },

  remove: (id) => {
    const index = prescriptions.findIndex(p => p.id === id);
    if (index === -1) return false;
    prescriptions.splice(index, 1);
    return true;
  }
};

module.exports = store;
