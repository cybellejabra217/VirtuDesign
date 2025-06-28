const Joi = require('joi');

const storeSchema = Joi.object({
    StoreName: Joi.string().required(), // Store name, required string
    Location: Joi.object({ // GeoJSON Point object
        type: Joi.string().valid('Point').required(), // Must be "Point"
        Coordinates: Joi.array().items(Joi.number()).length(2).required() // Array of two numbers (longitude, latitude), required
    }).required(),
    Address: Joi.string().required(), // Store address, required string
    Website: Joi.string().uri().optional() // Optional website URL
});

const validateStore = (storeData) => {
    const { error, value } = storeSchema.validate(storeData);
    if (error) {
        throw new Error(error.details[0].message); // Throw error if validation fails
    }
    return value; // Return validated data if successful
};

module.exports = {
    validateStore
};
