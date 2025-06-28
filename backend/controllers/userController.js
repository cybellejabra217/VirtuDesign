const Joi = require('joi');
const {
    findUserByUsername,
    findUserByEmail,
    findUserIdByUsername,
    findUsernameByUserId,
    getUserJoinDate
} = require('../services/userService');
const preferencesService = require('../services/preferencesService'); // Service for managing user preferences
const jwt = require('jsonwebtoken'); // For decoding JWT tokens

// Joi schema to validate the username parameter
const usernameSchema = Joi.object({
    username: Joi.string().trim().min(3).required().messages({
        'string.empty': 'Username is required',
        'string.min': 'Username must be at least 3 characters long',
        'any.required': 'Username is required'
    })
});

// Joi schema to validate the email parameter
const emailSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required'
    })
});

// Controller to fetch user details by username
const getUserByUsername = async (req, res) => {
    const { error } = usernameSchema.validate(req.params);  // Validate username param
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username } = req.params;

    try {
        const user = await findUserByUsername(username); // Retrieve user by username
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);  // Return found user
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user by username.' });
    }
};

// Controller to fetch user details by email
const getUserByEmail = async (req, res) => {
    const { error } = emailSchema.validate(req.params);  // Validate email param
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email } = req.params;

    try {
        const user = await findUserByEmail(email);  // Retrieve user by email
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);  // Return found user
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user by email.' });
    }
};

// Controller to fetch user ID by username
const getUserIdByUsername = async (req, res) => {
    const { error } = usernameSchema.validate(req.params);  // Validate username param
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username } = req.params;

    try {
        const userId = await findUserIdByUsername(username);  // Get user ID by username
        res.status(200).json({ userId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user ID by username.' });
    }
};

// Controller to fetch username by user ID
const getUsernameByUserId = async (req, res) => {
    const { userId } = req.params;
    // Validate that userId is a non-empty string
    if (typeof userId !== 'string' || !userId.trim()) {
        return res.status(400).json({ message: 'A valid user ID is required.' });
    }

    try {
        const username = await findUsernameByUserId(userId);  // Get username by user ID
        res.status(200).json({ username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch username by user ID.' });
    }
};

// Controller to get user join date by username
const getUserJoinDateByUsername = async (req, res) => {
    const { error } = usernameSchema.validate(req.params);  // Validate username param
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username } = req.params;

    try {
        const joinDate = await getUserJoinDate(username);  // Fetch join date for username
        res.status(200).json({ joinDate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user join date.' });
    }
};

// Controller to add user preferences (VibePreference and ColorPreferences)
const addPreferences = async (req, res) => {
    const { VibePreference, ColorPreferences } = req.body;
    // Check required fields are provided in request body
    if (!VibePreference || !ColorPreferences) {
        return res.status(400).json({ message: 'User ID, Vibe Preference, and Color Preferences are required.' });
    }

    const authHeader = req.headers.authorization;
    // Validate Authorization header presence and format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header is missing or invalid' });
    }
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.decode(token);  // Decode token without verification to extract userId
    const UserID = decodedToken?.userId;

    try {
        // Call service to create preferences for the authenticated user
        const preferences = await preferencesService.createPreferences({ UserID, VibePreference, ColorPreferences });
        res.status(201).json(preferences);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add preferences.' });
    }
};

// Controller to get preferences for the authenticated user
const getPreferences = async (req, res) => {
    const authHeader = req.headers.authorization;
    // Validate Authorization header presence and format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header is missing or invalid' });
    }
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.decode(token);  // Decode token without verification to extract userId
    const UserID = decodedToken?.userId;

    try {
        // Call service to retrieve preferences for the authenticated user
        const preferences = await preferencesService.getPreferencesByUser(UserID);
        res.status(200).json(preferences);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch preferences.' });
    }
};

module.exports = {
    getUserByUsername,
    getUserByEmail,
    getUserIdByUsername,
    getUsernameByUserId,
    getUserJoinDateByUsername,
    addPreferences,
    getPreferences
};
