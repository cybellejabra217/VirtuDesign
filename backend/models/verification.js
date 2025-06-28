const mongoose = require('mongoose');

// Define the schema for email verification records
const VerificationSchema = new mongoose.Schema({
    // Email address to verify; must be unique and valid format
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

    // The verification code sent to the user's email
    VerificationCode: {
        type: String,
        required: true,
    },

    // The date and time when the verification code expires
    VerificationExpiresAt: {
        type: Date,
        required: true
    }
});

// Export the Verification model
module.exports = mongoose.model('Verification', VerificationSchema);
