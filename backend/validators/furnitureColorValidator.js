const Joi = require('joi');
const { isValidObjectId } = require('./objectIdValidator');

// Joi schema for creating or updating a furniture color
const furnitureColorSchema = Joi.object({
    // ColorName must be a string with at least 3 characters and is required
    ColorName: Joi.string().min(3).required(),

    // ColorTone must be one of the predefined valid string values and is required
    ColorTone: Joi.string()
        .valid('Neutral', 'Bold', 'Pastel', 'Monochromatic', 'Earthy', 'Vibrant')
        .required(),
});

// Middleware to validate request body for furniture color creation or update
const validateFurnitureColor = (req, res, next) => {
    // Validate req.body against the furnitureColorSchema
    // abortEarly: false to collect all errors
    // allowUnknown: true to permit extra fields not defined in the schema
    const { error } = furnitureColorSchema.validate(req.body, { abortEarly: false, allowUnknown: true });
    if (error) {
        // Map all validation errors into a single string message
        const errorMessages = error.details.map(detail => detail.message).join(', ');
        return res.status(400).json({ message: errorMessages }); // Send 400 Bad Request with error messages
    }
    next(); // Proceed if validation passes
};

// Middleware to validate furniture color ID in route parameters
const validateFurnitureColorId = (req, res, next) => {
    const { id } = req.params;
    // Check if id is a valid MongoDB ObjectId using custom validator
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid color ID' }); // Return error if invalid
    }
    next(); // Proceed if valid
};

module.exports = {
    validateFurnitureColor,    // Export middleware to validate furniture color data
    validateFurnitureColorId,  // Export middleware to validate color ID param
    furnitureColorSchema       // Export Joi schema for direct use if needed
};
