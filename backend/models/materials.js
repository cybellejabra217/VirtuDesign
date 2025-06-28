const mongoose = require('mongoose');

// Define the schema for a material entry
const MaterialSchema = new mongoose.Schema({
    // Name of the material (e.g., "Oak Wood"); must be unique and trimmed of whitespace
    MaterialName: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },

    // Type/category of the material; must be one of the specified enum values
    MaterialType: { 
        type: String, 
        enum: ['Wood', 'Metal', 'Plastic', 'Glass', 'Fabric', 'Stone'], 
        required: true 
    },

    // Description of the material's properties or use
    MaterialDescription: {
        type: String,
        required: true
    },

    // Hexadecimal color code representing the material's color (e.g., "#AABBCC")
    MaterialHex: {
        type: String,
        required: true,
        validate: {
            validator: function(v) { 
                return /^#[0-9A-F]{6}$/i.test(v); 
            },
            message: 'MaterialHex must be a valid hex color code.'
        }
    },

    // Optional URL to an image representing the material; must be a valid URL if provided
    MaterialImage: { 
        type: String, 
        validate: { 
            validator: function (v) { 
                // Allow null or a valid HTTP/HTTPS URL
                return !v || /^https?:\/\//.test(v); 
            }, 
            message: 'MaterialImage must be a valid URL.'
        }, 
        default: null 
    }
}, { timestamps: true }); // Automatically manages createdAt and updatedAt fields

// Export the Material model
module.exports = mongoose.model('Material', MaterialSchema);
