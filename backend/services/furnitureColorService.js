const FurnitureColor = require('../models/furnitureColors'); 
const logger = require('../utils/logger');
const { isValidObjectId } = require('../validators/objectIdValidator');

// Add a new furniture color with provided data
// Logs success or error accordingly
const addColor = async (colorData) => {
    try {
        const color = await FurnitureColor.create(colorData);
        logger.info('Color added successfully');
        return color;
    } catch (error) {
        logger.error('Error adding color: ' + error.message);
        throw new Error('Error adding color: ' + error.message);
    }
};

// Retrieve a furniture color by its ID
// Validates the ID format first, throws error if invalid or not found
// Logs success or error accordingly
const getColorById = async (id) => {
    if (!isValidObjectId(id)) throw new Error('Invalid color ID');
    try {
        const color = await FurnitureColor.findById(id);
        if (!color) throw new Error('Color not found');
        logger.info('Color retrieved successfully');
        return color;
    } catch (error) {
        logger.error('Error retrieving color by ID: ' + error.message);
        throw new Error('Error retrieving color by ID: ' + error.message);
    }
};

// Retrieve all furniture colors
// Logs success or error accordingly
const getAllColors = async () => {
    try {
        const colors = await FurnitureColor.find();
        logger.info('All colors retrieved successfully');
        return colors;
    } catch (error) {
        logger.error('Error fetching all colors: ' + error.message);
        throw new Error('Error fetching all colors: ' + error.message);
    }
};

// Update an existing furniture color by ID with new data
// Validates ID format, throws error if invalid or color not found
// Logs success or error accordingly
const updateColor = async (id, colorData) => {
    if (!isValidObjectId(id)) throw new Error('Invalid color ID');
    try {
        const color = await FurnitureColor.findByIdAndUpdate(id, colorData, { new: true });
        if (!color) throw new Error('Color not found');
        logger.info('Color updated successfully');
        return color;
    } catch (error) {
        logger.error('Error updating color: ' + error.message);
        throw new Error('Error updating color: ' + error.message);
    }
};

// Delete a furniture color by ID
// Validates ID format, throws error if invalid or color not found
// Logs success or error accordingly
const deleteColor = async (id) => {
    if (!isValidObjectId(id)) throw new Error('Invalid color ID');
    try {
        const color = await FurnitureColor.findByIdAndDelete(id);
        if (!color) throw new Error('Color not found');
        logger.info('Color deleted successfully');
        return true;
    } catch (error) {
        logger.error('Error deleting color: ' + error.message);
        throw new Error('Error deleting color: ' + error.message);
    }
};

module.exports = {
    addColor,
    getColorById,
    getAllColors,
    updateColor,
    deleteColor
};
