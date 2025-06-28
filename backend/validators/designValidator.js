const Joi = require('joi'); // Import Joi validation library

// Schema to validate design data structure
const designValidationSchema = Joi.object({
    // Design name: required string with minimum length of 3 characters
    name: Joi.string().min(3).required(),

    // Optional design description as a string
    description: Joi.string().optional(),

    // Optional array of material IDs (strings)
    materials: Joi.array().items(Joi.string()).optional(),

    // Optional array of furniture IDs (strings)
    furniture: Joi.array().items(Joi.string()).optional(),

    // Required layout object defining design layout details
    layout: Joi.object().required(),
});

// Function to validate a design ID string (must be a 24-character hex string, typical for MongoDB ObjectId)
const validateDesignId = (designId) => {
    const schema = Joi.string().hex().length(24).required();
    return schema.validate(designId);
};

module.exports = {
    designValidationSchema, // Export design data schema
    validateDesignId,       // Export design ID validation function
};
