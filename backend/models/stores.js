const mongoose = require('mongoose');

// Define the schema for a Store
const StoreSchema = new mongoose.Schema({
    // Name of the store; must be unique and trimmed
    StoreName: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },

    // Geospatial location using GeoJSON format
    Location: {
        type: {
            type: String,
            enum: ['Point'], // Only allowed type is 'Point' for GeoJSON
            default: 'Point'
        },
        Coordinates: {
            type: [Number], // Format: [longitude, latitude]
            required: true
        }
    },

    // Physical address of the store
    Address: { 
        type: String, 
        required: true, 
        trim: true 
    },

    // Optional website URL with validation
    Website: { 
        type: String, 
        validate: {
            validator: function(value) {
                return /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(value);
            },
            message: 'Website must be a valid URL.'
        },
        required: false
    },

    // Required image URL or path for the store
    image: { 
        type: String, 
        required: true 
    },
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps automatically

// Create a 2dsphere index on the location field for geospatial queries
StoreSchema.index({ location: '2dsphere' });

// Export the Store model
module.exports = mongoose.model('Store', StoreSchema);
