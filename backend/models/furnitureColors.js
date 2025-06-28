const mongoose = require('mongoose');

// Define the schema for furniture colors
const FurnitureColorsSchema = new mongoose.Schema({
    // Name of the color (e.g., "Beige", "Royal Blue"); must be unique
    ColorName: { 
        type: String, 
        required: true, 
        unique: true 
    },

    // Tone category of the color, restricted to predefined values
    ColorTone: { 
        type: String, 
        enum: ['Neutral', 'Bold', 'Pastel', 'Monochromatic', 'Earthy', 'Vibrant'], 
        required: true 
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Export the model based on the schema
module.exports = mongoose.model('FurnitureColors', FurnitureColorsSchema);
