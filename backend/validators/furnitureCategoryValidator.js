const Joi = require('joi'); // Import Joi validation library

// Schema for validating data when creating a new Furniture Category
const createFurnitureCategorySchema = Joi.object({
    // Name of the furniture category, required string
    name: Joi.string().required(),      

    // Room type associated with this category, required string (usually an ID)
    roomType: Joi.string().required()     
});

// Schema for validating data when updating an existing Furniture Category
const updateFurnitureCategorySchema = Joi.object({
    // Name of the furniture category, optional string
    name: Joi.string().optional(),

    // Room type associated with this category, optional string (usually an ID)
    roomType: Joi.string().optional()
});

module.exports = {
    createFurnitureCategorySchema, // Export create validation schema
    updateFurnitureCategorySchema  // Export update validation schema
};
