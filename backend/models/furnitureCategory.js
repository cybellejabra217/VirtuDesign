const mongoose = require('mongoose');

// Define the schema for a furniture category
const FurnitureCategorySchema = new mongoose.Schema({
    // Name of the category (e.g., Sofa, Bed); must be unique
    CategoryName: { 
        type: String, 
        required: true, 
        unique: true 
    },

    // Reference to the associated room type (e.g., Bedroom, Living Room)
    RoomType: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'RoomTypes',  
        required: true
    }

}, { timestamps: true }); // Adds createdAt and updatedAt timestamps automatically

// Export the model based on the schema
module.exports = mongoose.model('FurnitureCategory', FurnitureCategorySchema);
