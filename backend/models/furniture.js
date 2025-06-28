const mongoose = require('mongoose');

// Define the schema for a furniture item
const FurnitureSchema = new mongoose.Schema({
    // Name of the furniture item, must be unique
    FurnitureName: { 
        type: String, 
        required: true, 
        unique: true 
    },

    // Reference to the furniture category (e.g., Chair, Table)
    FurnitureCategoryID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'FurnitureCategory', 
        required: true 
    },

    // Reference to the furniture color
    FurnitureColorID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'FurnitureColors', 
        required: true 
    },

    // Width of the furniture in appropriate measurement units
    FurnitureWidth: { 
        type: Number, 
        required: true, 
        min: [0, 'Furniture width cannot be negative.'] 
    },

    // Height of the furniture
    FurnitureHeight: { 
        type: Number, 
        required: true, 
        min: [0, 'Furniture height cannot be negative.'] 
    },

    // Depth of the furniture
    FurnitureDepth: { 
        type: Number, 
        required: true, 
        min: [0, 'Furniture depth cannot be negative.'] 
    },

    // Optional picture URL of the furniture; must be a valid HTTP/HTTPS link if provided
    FurniturePicture: { 
        type: String, 
        validate: { 
            validator: function (v) { 
                return /^https?:\/\//.test(v); 
            }, 
            message: 'Furniture picture must be a valid URL.' 
        }, 
        default: null 
    },

    // Price of the furniture; must be non-negative
    FurniturePrice: { 
        type: Number, 
        required: true, 
        min: [0, 'Furniture price cannot be negative.'] 
    },

    // Reference to the material used in the furniture
    FurnitureMaterialID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Material', 
        required: true 
    },

    // Reference to the store where the furniture is available
    StoreID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Store', 
        required: true 
    },

    // Reference to the room type this furniture is suited for
    RoomTypeID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'RoomType', 
        required: true 
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

// Export the model based on the schema
module.exports = mongoose.model('Furniture', FurnitureSchema);
