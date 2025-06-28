const mongoose = require('mongoose');

// Define the schema for different types of rooms
const RoomTypesSchema = new mongoose.Schema({
    // Name of the room (e.g., "Living Room", "Bedroom"); must be unique and trimmed of whitespace
    RoomName: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    }
}, { timestamps: true }); // Automatically includes createdAt and updatedAt timestamps

// Export the RoomTypes model
module.exports = mongoose.model('RoomTypes', RoomTypesSchema);
