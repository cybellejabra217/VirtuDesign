const express = require('express'); // Import Express framework
const router = express.Router(); // Create a new router instance
const { handleServiceCall } = require('../utils/handleServiceCall'); // Utility to handle service calls
const furnitureCategoryService = require('../services/furnitureCategoryService'); // Service for furniture category operations
const { isValidObjectId } = require('../validators/objectIdValidator'); // Validator for MongoDB ObjectIds
const { createFurnitureCategorySchema, updateFurnitureCategorySchema } = require('../validators/furnitureCategoryValidator'); // Validation schemas for furniture categories
const { validateRequest } = require('../utils/validateRequest'); // Middleware to validate requests
const requireAdmin = require('../middleware/authAdminMiddleware'); // Middleware to require admin privileges

// Route to create a new furniture category
router.post('/', requireAdmin, async (req, res) => {
    try {
        // Validate and sanitize incoming data using our custom validator utility
        const validatedBody = validateRequest(req, res, () => {}, createFurnitureCategorySchema);
        // Map client-friendly fields to the model's fields
        const categoryData = {
            CategoryName: req.body.name,
            RoomType: req.body.roomType
        };
        // Call service to create category and handle response/errors
        await handleServiceCall(furnitureCategoryService.createCategory, res, categoryData);
    } catch (error) {
        // Send back validation or processing errors
        res.status(400).json({ message: error.message });
    }
});

// Route to get a category by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    // Validate that the ID is a valid MongoDB ObjectId
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid category ID' });
    }
    // Call service to get category by ID and handle response/errors
    handleServiceCall(furnitureCategoryService.getCategoryById, res, id);
});

// Route to get all categories
router.get('/', (req, res) => {
    // Call service to get all categories and handle response/errors
    handleServiceCall(furnitureCategoryService.getAllCategories, res);
});

// Route to update a furniture category
router.put('/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    // Validate the category ID format
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid category ID' });
    }
    try {
        // Validate incoming update data
        const validatedBody = validateRequest(req, res, () => {}, createFurnitureCategorySchema);
        // Build update object only with provided fields
        const updateData = {};
        if (req.body.name) updateData.CategoryName = req.body.name;
        if (req.body.roomType) updateData.RoomType = req.body.roomType;
        // Call service to update category and handle response/errors
        await handleServiceCall(furnitureCategoryService.updateCategory, res, id, updateData);
    } catch (error) {
        // Send back errors encountered during validation or update
        res.status(400).json({ message: error.message });
    }
});

// Route to delete a furniture category
router.delete('/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    // Validate the category ID format
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid category ID' });
    }
    // Call service to delete category and handle response/errors
    handleServiceCall(furnitureCategoryService.deleteCategory, res, id);
});

module.exports = router; // Export the router
