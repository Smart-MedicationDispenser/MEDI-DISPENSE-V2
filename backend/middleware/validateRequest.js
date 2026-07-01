const { z } = require('zod');
const logger = require('../utils/logger');

/**
 * Zod validation schemas
 */
const schemas = {
  patient: z.object({
    name: z.string().min(1, "Name is required"),
    ward: z.string().min(1, "Ward is required"),
    medication: z.string().min(1, "Medication is required"),
    next: z.string().regex(/^\d{1,2}:\d{2}$/, "Next dose must be in HH:MM format").optional().or(z.literal("—")).or(z.literal("")),
    status: z.enum(["Active", "Scheduled", "Missed"]).optional()
  }),
  
  medication: z.object({
    name: z.string().min(1, "Name is required"),
    stock: z.number().int().min(0, "Stock cannot be negative").optional(),
    unit: z.string().optional(),
    status: z.enum(["In Stock", "Low Stock", "Out of Stock"]).optional()
  }),

  device: z.object({
    name: z.string().min(1, "Name is required"),
    ward: z.string().min(1, "Ward is required"),
    status: z.enum(["Online", "Offline", "Error"]).optional(),
    battery: z.number().min(0).max(100).optional(),
    lastPing: z.string().optional()
  }),

  prescription: z.object({
    patientId: z.string().min(1, "Patient ID is required"),
    medication: z.string().min(1, "Medication is required"),
    dosage: z.string().min(1, "Dosage is required"),
    frequency: z.string().min(1, "Frequency is required")
  }),

  settings: z.object({
    theme: z.string().optional(),
    notifications: z.boolean().optional(),
    dispenseTimeout: z.number().int().min(1).optional()
  })
};

/**
 * Middleware factory for validating request bodies
 * @param {string} schemaName - The key of the schema in the `schemas` object
 */
const validateRequest = (schemaName) => {
  return async (req, res, next) => {
    try {
      const schema = schemas[schemaName];
      if (!schema) {
        throw new Error(`Validation schema '${schemaName}' not found.`);
      }

      // Parse and validate the request body
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Map Zod errors to a simpler format
        const errorDetails = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        logger.warn(`Validation failed for ${req.path}`, errorDetails);
        
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: errorDetails
        });
      }
      next(error);
    }
  };
};

module.exports = {
  validateRequest,
  schemas
};
