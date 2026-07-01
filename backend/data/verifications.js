let verifications = [
  {
    id: "VQ-001",
    patient: "Ahmad Faris",
    medication: "Metformin 500mg",
    deviceId: "DEV-001",
    scheduledTime: "09:00",
    status: "Waiting",
    priority: "High"
  }
];

const store = {
  getAll: () => verifications,
  
  getById: (id) => verifications.find(v => v.id === id) || null,

  update: (id, fields) => {
    const index = verifications.findIndex(v => v.id === id);
    if (index === -1) return null;
    verifications[index] = { ...verifications[index], ...fields };
    return verifications[index];
  }
};

module.exports = store;
