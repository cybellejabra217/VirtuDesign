const express = require('express'); // Import Express framework
const { getRoomTypeByIdController, getAllRoomTypesController, getRoomTypeIdByNameController, addRoomTypeController, updateRoomTypeController, deleteRoomTypeController } = require('../controllers/roomTypesController'); // Import room types controllers
const requireAdmin = require('../middleware/authAdminMiddleware'); // Middleware to require admin privileges
const router = express.Router(); // Create a new router instance

router.get('/:id', getRoomTypeByIdController); // Route to get a room type by ID
router.get('/', getAllRoomTypesController); // Route to get all room types
router.get('/name/:name', getRoomTypeIdByNameController); // Route to get room type ID by name
router.post('/', requireAdmin, addRoomTypeController); // Route to add a new room type, admin only
router.put('/:id', requireAdmin, updateRoomTypeController); // Route to update a room type by ID, admin only
router.delete('/:id', requireAdmin, deleteRoomTypeController); // Route to delete a room type by ID, admin only

module.exports = router; // Export the router
