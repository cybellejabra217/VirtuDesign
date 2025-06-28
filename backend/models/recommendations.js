const mongoose = require('mongoose');

// Define the schema for recommendations associated with a user
const RecommendationsSchema = new mongoose.Schema({
    // Reference to the user receiving these recommendations
    UserID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },

    // List of recommended furniture item IDs
    FurnitureRecommendations: { 
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'Furniture', 
        required: true 
    },

    // List of recommended material IDs
    MaterialRecommendations: { 
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'Material', 
        required: true 
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

// Export the Recommendations model
module.exports = mongoose.model('Recommendations', RecommendationsSchema);
