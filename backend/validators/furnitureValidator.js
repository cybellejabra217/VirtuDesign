const Joi = require('joi');

const furnitureSchema = Joi.object({
    FurnitureName: Joi.string().min(3).required(),         // Furniture name, at least 3 chars, required
    FurnitureCategoryID: Joi.string().required(),          // ID of furniture category, required
    FurnitureColorID: Joi.string().required(),             // ID of furniture color, required
    FurnitureWidth: Joi.number().required(),               // Width dimension (number), required
    FurnitureHeight: Joi.number().required(),              // Height dimension (number), required
    FurnitureDepth: Joi.number().required(),               // Depth dimension (number), required
    FurniturePrice: Joi.number().min(0).required(),        // Price, must be ≥ 0, required
    FurnitureMaterialID: Joi.string().required(),          // ID of material used, required
    StoreID: Joi.string().required(),                       // ID of store, required
    RoomTypeID: Joi.string().required(),                    // ID of room type, required
    FurniturePicture: Joi.string().uri().optional().allow(null) // Optional image URL or null
});

module.exports = { furnitureSchema };
