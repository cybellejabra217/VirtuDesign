const Joi = require('joi');

const emailSchema = Joi.string().email().trim().lowercase().required(); // Valid email, trimmed & lowercase, required
const usernameSchema = Joi.string().min(3).max(30).trim().required(); // Username 3-30 chars, trimmed, required
const passwordSchema = Joi.string().min(6).required(); // Password min 6 chars, required
const confirmPasswordSchema = Joi.string().valid(Joi.ref('password')).required().messages({ // Must match password
    'any.only': 'Passwords do not match'
});

// Schema for verification code
const verificationSchema = Joi.object({
    email: emailSchema, // Email field using emailSchema
    verificationCode: Joi.string().required(), // Verification code, required
});

// Schema for registration
const registerSchema = Joi.object({
    email: emailSchema, // Email for registration
    username: usernameSchema, // Username for registration
    password: passwordSchema, // Password for registration
    confirmPassword: confirmPasswordSchema, // Confirm password, must match password
});

// Schema for login
const loginSchema = Joi.object({
    username: usernameSchema, // Username for login
    password: passwordSchema, // Password for login
});

module.exports = {
    emailSchema,
    verificationSchema,
    registerSchema,
    loginSchema,
};
