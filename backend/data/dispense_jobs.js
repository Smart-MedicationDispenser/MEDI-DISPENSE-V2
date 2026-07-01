let jobs = [
  {
    id: "JOB-001",
    patient: "Ahmad Faris",
    medication: "Metformin 500mg",
    device: "DEV-001",
    ward: "3B",
    time: "09:00",
    status: "Pending"
  }
];

const store = {
  getAll: () => jobs,
  
  getById: (id) => jobs.find(j => j.id === id) || null,

  update: (id, fields) => {
    const index = jobs.findIndex(j => j.id === id);
    if (index === -1) return null;
    jobs[index] = { ...jobs[index], ...fields };
    return jobs[index];
  }
};

module.exports = store;
