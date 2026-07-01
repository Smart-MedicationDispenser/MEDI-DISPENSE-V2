/**
 * Centralized Application Configuration (Backend)
 */
const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Feature Flags
  FEATURES: {
    ENABLE_CV: false,
    ENABLE_IOT: false,
    ENABLE_AI_SCHEDULER: false,
  },
  
  // Mock Data Limitations
  MOCK: {
    MAX_AUDIT_LOGS: 500,
  }
};

module.exports = ENV;
