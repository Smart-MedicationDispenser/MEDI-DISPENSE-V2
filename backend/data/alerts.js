// In-memory alert store.
// Seed shape mirrors INITIAL_ALERTS in Alerts.jsx:
// { id, type, patient, device, ward, desc, time, status }
// type   enum : "Medication" | "Device"
// status enum : "Active" | "Warning" | "Critical" | "Resolved"

let alerts = [
  { id: 'ALR-301', type: 'Medication', patient: 'Ahmad Faris',   device: 'DEV-7F3A', ward: 'Ward 3B',  desc: 'Missed dose detected',              time: '09:32', status: 'Active'   },
  { id: 'ALR-302', type: 'Device',     patient: '—',             device: 'DEV-9A12', ward: 'Ward 2A',  desc: 'Device offline',                    time: '09:20', status: 'Critical' },
  { id: 'ALR-303', type: 'Medication', patient: 'Sarah Khan',    device: 'DEV-5C8D', ward: 'Ward 4C',  desc: 'Low medication stock',              time: '08:55', status: 'Active'   },
  { id: 'ALR-304', type: 'Device',     patient: '—',             device: 'DEV-2B19', ward: 'Ward ICU', desc: 'Battery below 15%',                 time: '08:40', status: 'Warning'  },
  { id: 'ALR-305', type: 'Medication', patient: 'Nurul Huda',    device: 'DEV-1E4F', ward: 'Ward 1D',  desc: 'Overdose threshold exceeded',       time: '08:22', status: 'Critical' },
  { id: 'ALR-306', type: 'Device',     patient: '—',             device: 'DEV-4F6E', ward: 'Ward 2A',  desc: 'Heartbeat timeout (>10 min)',        time: '08:10', status: 'Warning'  },
  { id: 'ALR-307', type: 'Medication', patient: 'Lee Chong Wei', device: 'DEV-3C7B', ward: 'Ward 5B',  desc: 'Medication slot empty',             time: '07:58', status: 'Active'   },
  { id: 'ALR-308', type: 'Device',     patient: '—',             device: 'DEV-8D2A', ward: 'Ward 3B',  desc: 'Sensor calibration failed',         time: '07:45', status: 'Resolved' },
  { id: 'ALR-309', type: 'Medication', patient: 'Priya Nair',    device: 'DEV-6A1C', ward: 'Ward ICU', desc: 'Dose dispensed without confirm',    time: '07:30', status: 'Resolved' },
  { id: 'ALR-310', type: 'Device',     patient: '—',             device: 'DEV-7E8A', ward: 'Ward 5B',  desc: 'Battery critical — 8%',             time: '07:15', status: 'Warning'  },
];

let _seq = 311; // Next ID counter

const store = {
  getAll: () => alerts,

  getById: (id) => alerts.find((a) => a.id === id) || null,

  add: (alert) => {
    const id = 'ALR-' + String(_seq++).padStart(3, '0');
    const entry = { ...alert, id };
    alerts.push(entry);
    return entry;
  },

  resolve: (id) => {
    const idx = alerts.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    if (alerts[idx].status === 'Resolved') return alerts[idx]; // idempotent
    alerts[idx] = { ...alerts[idx], status: 'Resolved' };
    return alerts[idx];
  },

  remove: (id) => {
    const exists = alerts.some((a) => a.id === id);
    if (!exists) return false;
    alerts = alerts.filter((a) => a.id !== id);
    return true;
  }
};

module.exports = store;