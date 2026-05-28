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

  add: (patient) => {
    patients.push(patient);
    return patient;
  },

  remove: (id) => {
    const index = patients.findIndex((p) => p.id === id);

    if (index === -1) return false;

    patients.splice(index, 1);

    return true;
  }
};

module.exports = store;