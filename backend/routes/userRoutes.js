const express = require('express'); // Import Express framework
const router = express.Router(); // Create a new router instance
const {
  getUserByUsername, // Controller to get user by username
  getUserByEmail, // Controller to get user by email
  getUserIdByUsername, // Controller to get user ID by username
  getUsernameByUserId, // (Imported but unused) Controller to get username by user ID
  getUserJoinDateByUsername, // Controller to get user join date by username
  addPreferences, // Controller to add user preferences
  getPreferences, // Controller to get user preferences
} = require('../controllers/userController'); // Import user-related controllers

// Routes for user info retrieval
router.get('/username/:username', getUserByUsername); // Get user details by username
router.get('/user/email/:email', getUserByEmail); // Get user details by email
router.get('/userId/:username', getUserIdByUsername); // Get user ID by username
router.get('/joinDate/:username', getUserJoinDateByUsername); // Get user join date by username

// Routes for user preferences
router.post('/preferences', addPreferences); // Add or update preferences
router.get('/preferences', getPreferences); // Get preferences

module.exports = router; // Export the router
