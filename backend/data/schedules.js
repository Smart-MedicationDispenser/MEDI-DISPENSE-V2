let schedules = [
  {
    id: "SCH-001",
    patient: "Ahmad Faris",
    prescriptionId: "RX-1001",
    medication: "Metformin 500mg",
    deviceId: "DEV-001",
    time: "09:00",
    status: "Completed"
  },
  {
    id: "SCH-002",
    patient: "Ahmad Faris",
    prescriptionId: "RX-1001",
    medication: "Metformin 500mg",
    deviceId: "DEV-001",
    time: "21:00",
    status: "Upcoming"
  }
];

const store = {
  getAll: () => schedules,
  
  getById: (id) => schedules.find(s => s.id === id) || null,

  update: (id, fields) => {
    const index = schedules.findIndex(s => s.id === id);
    if (index === -1) return null;
    schedules[index] = { ...schedules[index], ...fields };
    return schedules[index];
  }
};

module.exports = store;
