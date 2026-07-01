let audits = [
  {
    id: "A-0001",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user: "Dr. System Admin",
    module: "Patient",
    action: "Update",
    result: "Success"
  }
];

const store = {
  getAll: () => audits,
  
  add: (entry) => {
    audits.unshift(entry); // Add to beginning (latest first)
    if (audits.length > 500) audits.pop(); // Keep bounded
    return entry;
  }
};

module.exports = store;
