// const patients = [
//   {
//     id: "P-1021",
//     name: "Ahmad Faris",
//     ward: "3B",
//     medication: "Metformin 500mg",
//     next: "09:00",
//     status: "Active"
//   }
// ];

// module.exports = patients;

// In-memory patient store.
// Wraps the array so service layer shares a single mutable reference.
// Fixes silent DELETE bug where local reassignment didn't affect exported array.

let patients = [
  {
    id: 'P-1021',
    name: 'Ahmad Faris',
    ward: '3B',
    medication: 'Metformin 500mg',
    next: '09:00',
    status: 'Active'
  }
];

const store = {
  getAll: () => patients,

  getById: (id) => patients.find((p) => p.id === id) || null,

  add: (patient) => {
    patients.push(patient);
    return patient;
  },

  // Sprint 3 — update an existing patient by id.
  // Only merges safe fields; id is never overwritten.
  update: (id, fields) => {
    const index = patients.findIndex((p) => p.id === id);
    if (index === -1) return null;
    patients[index] = {
      ...patients[index],
      name:       fields.name       ?? patients[index].name,
      ward:       fields.ward       ?? patients[index].ward,
      medication: fields.medication ?? patients[index].medication,
      next:       fields.next       ?? patients[index].next,
      status:     fields.status     ?? patients[index].status,
    };
    return patients[index];
  },

  remove: (id) => {
    const index = patients.findIndex((p) => p.id === id);
    if (index === -1) return false;
    patients.splice(index, 1);
    return true;
  },
};

module.exports = store;