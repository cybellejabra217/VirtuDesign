const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema for a User
const UserSchema = new mongoose.Schema({
    // Unique username, trimmed for whitespace
    Username: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },

    // User password; minimum length of 6 characters
    Password: { 
        type: String, 
        required: true, 
        minlength: [6, 'Password should be at least 6 characters long.']
    },

    // Unique email with regex validation
    Email: { 
        type: String, 
        required: true, 
        unique: true, 
        validate: {
            validator: function(value) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
            },
            message: 'Must be a valid email address.'
        }
    },

    // The date the user joined; defaults to current date
    JoinDate: { 
        type: Date, 
        default: Date.now, 
        required: true
    },

    // X coordinate of user's location
    UserLocationX: { 
        type: Number, 
        required: true
    },

    // Y coordinate of user's location
    UserLocationY: { 
        type: Number, 
        required: true
    },

    // Array of Preference document references
    PreferencesIDs: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Preferences'
    }],

    // Array of Design document references
    DesignsIDs: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Design'
    }],

    // Email verification status
    IsVerified: { 
        type: Boolean, 
        default: false 
    },

    // Admin privileges flag
    IsAdmin: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Middleware to delete related preferences when a user is removed
UserSchema.pre('remove', async function(next) {
    try {
        const Preferences = mongoose.model('Preferences');
        if (this.PreferencesIDs && this.PreferencesIDs.length > 0) {
            await Preferences.deleteMany({ _id: { $in: this.PreferencesIDs } });
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Export the User model
module.exports = mongoose.model('User', UserSchema);
