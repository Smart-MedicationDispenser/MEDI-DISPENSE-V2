const logger = require('./logger');

/**
 * Standardized Error Handling Middleware
 * Ensures all API errors return a consistent JSON structure.
 */
const errorHandler = (err, req, res, next) => {
  logger.error(`Unhandled Error at ${req.path}`, err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
    errors: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
