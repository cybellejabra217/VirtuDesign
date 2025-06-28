const Joi = require('joi');

const createMaterialSchema = Joi.object({
    name: Joi.string().min(3).required(), // Material name, min 3 chars, required
    type: Joi.string().valid('Wood', 'Metal', 'Plastic', 'Glass', 'Fabric', 'Stone').required(), // Material type, limited options, required
    description: Joi.string().min(10).required(), // Description min 10 chars, required
    hex: Joi.string().pattern(/^#[0-9A-F]{6}$/i).required(), // Hex color code, required
    image: Joi.string().uri().optional() // Optional image URL
});

const updateMaterialSchema = Joi.object({
    name: Joi.string().min(3).optional(), // Optional name update, min 3 chars
    type: Joi.string().valid('Wood', 'Metal', 'Plastic', 'Glass', 'Fabric', 'Stone').optional(), // Optional type update
    description: Joi.string().min(10).optional(), // Optional description update
    hex: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(), // Optional hex color update
    image: Joi.string().uri().optional() // Optional image URL update
});

module.exports = {
    createMaterialSchema,
    updateMaterialSchema
};
