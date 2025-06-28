const Joi = require('joi');

const validateRequest = (req, res, next, schema) => {
    // Validate the request body against the provided Joi schema
    const { error, value } = schema.validate(req.body, { abortEarly: false, allowUnknown: true });
    
    // If there are validation errors, collect and throw them as an Error
    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        throw new Error(errorMessages.join(', '));
    }
    
    // Proceed to the next middleware or route handler if validation passes
    next();
};

module.exports = { validateRequest };
