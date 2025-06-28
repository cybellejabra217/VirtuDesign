const mongoose = require('mongoose');

// Define the schema for user preferences
const PreferencesSchema = new mongoose.Schema({
    // Reference to the User who owns these preferences
    UserID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        onDelete: 'CASCADE' // Implies the preferences should be deleted if the user is deleted (note: this is for documentation only; mongoose doesn't enforce this directly)
    },

    // User's preferred interior design style (optional)
    VibePreference: { 
        type: String, 
        enum: ['Minimalist', 'Rustic', 'Modern', 'Bohemian', 'Industrial', 'Traditional'], 
        default: null 
    },

    // User's preferred color tone; must be selected
    ColorPreferences: { 
        type: String, 
        enum: ['Neutral', 'Bold', 'Pastel', 'Monochromatic', 'Earthy', 'Vibrant'], 
        required: true
        // Example: Neutral
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

// Export the model based on the schema
module.exports = mongoose.model('Preferences', PreferencesSchema);
