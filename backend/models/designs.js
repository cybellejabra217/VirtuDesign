const mongoose = require('mongoose');

// Define the schema for a design entry
const DesignSchema = new mongoose.Schema({
    // Reference to the furniture used in the design
    FurnitureUsedID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Furniture',
        required: true
    },

    // Reference to the materials used in the design
    MaterialsUsedID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material',
        required: true
    },

    // Reference to the recommendation associated with the design
    RecommendationID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recommendations',
        required: true
    },

    // Originally, RoomType was a string with an enum, now it's referenced from a separate collection
    // RoomType: {
    //     type: String,
    //     enum: ['Living Room', 'Bedroom', 'Kitchen', 'Office', 'Bathroom', 'Dining Room'],
    //     required: true
    // },

    // Reference to the room type from the RoomType collection
    RoomTypeID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'RoomType', 
        required: true 
    },

    // Budget for the design; must be a non-negative number
    Budget: {
        type: Number,
        required: true,
        min: [0, 'Budget cannot be negative.']
    },

    // Reference to the user who created the design
    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // URL pointing to the 3D model or asset for the design
    ModelURL: {
        type: String,
        required: true
    },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Export the model based on the schema
module.exports = mongoose.model('Design', DesignSchema);
