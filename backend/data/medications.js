// In-memory medication store.
// Seed data mirrors INITIAL_MEDS shape in Medications.jsx:
// { id, name, dosage, stock, threshold, expiry, status }

let medications = [
  { id: 'MED-201', name: 'Metformin',    dosage: '500mg', stock: 24, threshold: 10, expiry: '2026-04-01', status: 'OK'        },
  { id: 'MED-202', name: 'Paracetamol',  dosage: '1g',    stock:  5, threshold: 10, expiry: '2025-11-02', status: 'Low Stock' },
  { id: 'MED-203', name: 'Insulin',      dosage: '10U',   stock: 12, threshold:  8, expiry: '2025-12-10', status: 'OK'        },
  { id: 'MED-204', name: 'Amlodipine',   dosage: '5mg',   stock:  3, threshold:  6, expiry: '2025-10-01', status: 'Critical'  },
  { id: 'MED-205', name: 'Atorvastatin', dosage: '20mg',  stock: 31, threshold: 12, expiry: '2026-08-15', status: 'OK'        },
  { id: 'MED-206', name: 'Metoprolol',   dosage: '25mg',  stock:  7, threshold: 10, expiry: '2025-10-20', status: 'Low Stock' },
  { id: 'MED-207', name: 'Lisinopril',   dosage: '10mg',  stock: 18, threshold:  8, expiry: '2026-01-30', status: 'OK'        },
  { id: 'MED-208', name: 'Omeprazole',   dosage: '20mg',  stock:  2, threshold:  8, expiry: '2025-09-05', status: 'Critical'  },
  { id: 'MED-209', name: 'Amoxicillin',  dosage: '250mg', stock: 45, threshold: 15, expiry: '2026-06-12', status: 'OK'        },
  { id: 'MED-210', name: 'Prednisolone', dosage: '5mg',   stock:  6, threshold: 10, expiry: '2025-11-28', status: 'Low Stock' },
];

const store = {
  getAll: () => medications,

  getById: (id) => medications.find((m) => m.id === id) || null,

  add: (med) => {
    medications.push(med);
    return med;
  },

  update: (id, updates) => {
    const idx = medications.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    medications[idx] = { ...medications[idx], ...updates };
    return medications[idx];
  },

  remove: (id) => {
    const exists = medications.some((m) => m.id === id);
    if (!exists) return false;
    medications = medications.filter((m) => m.id !== id);
    return true;
  }
};

module.exports = store;