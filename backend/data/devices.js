// In-memory device store.
// Seed shape matches Devices.jsx UI fields:
// { id, ward, room, status, battery, slotsUsed, slotsTotal, lastHeartbeat }
// Status enum: "Online" | "Offline" | "Battery Low" | "Restarting"

let devices = [
  {
    id:            'DEV-7F3A',
    ward:          'Ward 3B',
    room:          'Room 08',
    status:        'Online',
    battery:       87,
    slotsUsed:     3,
    slotsTotal:    6,
    lastHeartbeat: '08:42'
  },
  {
    id:            'DEV-9A12',
    ward:          'Ward 4C',
    room:          'Room 02',
    status:        'Offline',
    battery:       null,
    slotsUsed:     0,
    slotsTotal:    6,
    lastHeartbeat: '07:15'
  },
  {
    id:            'DEV-5C8D',
    ward:          'Ward 5B',
    room:          'Room 11',
    status:        'Battery Low',
    battery:       22,
    slotsUsed:     5,
    slotsTotal:    6,
    lastHeartbeat: '08:39'
  }
];

const store = {
  getAll: () => devices,

  getById: (id) => devices.find((d) => d.id === id) || null,

  add: (device) => {
    devices.push(device);
    return device;
  },

  update: (id, updates) => {
    const idx = devices.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    devices[idx] = { ...devices[idx], ...updates };
    return devices[idx];
  },

  remove: (id) => {
    const exists = devices.some((d) => d.id === id);
    if (!exists) return false;
    devices = devices.filter((d) => d.id !== id);
    return true;
  }
};

module.exports = store;