const Furniture = require('../models/furniture');
const { isValidObjectId } = require('../validators/objectIdValidator');
const logger = require('../utils/logger');

// Adds a new furniture item with provided data.
// Logs success or throws error on failure.
const addFurniture = async (furnitureData) => {
    try {
        const result = await Furniture.create(furnitureData);
        logger.info(`Furniture added with ID ${result._id}`);
        return result;
    } catch (error) {
        throw new Error('Error adding furniture: ' + error.message);
    }
};

// Retrieves a furniture item by its ID.
// Validates ID format and throws errors if invalid or not found.
// Logs success or error.
const getFurnitureById = async (id) => {
    if (!isValidObjectId(id)) {
        throw new Error('Invalid furniture ID');
    }
    try {
        const result = await Furniture.findById(id);
        if (!result) throw new Error('Furniture not found');
        logger.info(`Furniture retrieved with ID ${id}`);
        return result;
    } catch (error) {
        throw new Error('Error retrieving furniture by ID: ' + error.message);
    }
};

// Retrieves all furniture items.
// Logs success or throws error on failure.
const getAllFurniture = async () => {
    try {
        const result = await Furniture.find();
        logger.info('Retrieved all furniture');
        return result;
    } catch (error) {
        throw new Error('Error fetching all furniture: ' + error.message);
    }
};

// Updates a furniture item by ID with new data.
// Validates ID and throws errors if invalid or item not found.
// Logs success or error.
const updateFurniture = async (id, furnitureData) => {
    if (!isValidObjectId(id)) {
        throw new Error('Invalid furniture ID');
    }
    try {
        const result = await Furniture.findByIdAndUpdate(id, furnitureData, { new: true });
        if (!result) throw new Error('Furniture not found');
        logger.info(`Furniture updated with ID ${id}`);
        return result;
    } catch (error) {
        throw new Error('Error updating furniture: ' + error.message);
    }
};

// Deletes a furniture item by ID.
// Validates ID and throws errors if invalid or item not found.
// Logs success or error.
const deleteFurniture = async (id) => {
    if (!isValidObjectId(id)) {
        throw new Error('Invalid furniture ID');
    }
    try {
        const result = await Furniture.findByIdAndDelete(id);
        if (!result) throw new Error('Furniture not found');
        logger.info(`Furniture deleted with ID ${id}`);
        return true;
    } catch (error) {
        throw new Error('Error deleting furniture: ' + error.message);
    }
};

// Retrieves furniture items filtered by category ID.
// Logs success or error.
const getFurnitureByCategory = async (category) => {
    try {
        const result = await Furniture.find({ FurnitureCategoryID: category });
        logger.info(`Furniture retrieved by category: ${category}`);
        return result;
    } catch (error) {
        throw new Error('Error retrieving furniture by category: ' + error.message);
    }
};

// Retrieves furniture items filtered by color ID.
// Logs success or error.
const getFurnitureByColor = async (color) => {
    try {
        const result = await Furniture.find({ FurnitureColorID: color });
        logger.info(`Furniture retrieved by color: ${color}`);
        return result;
    } catch (error) {
        throw new Error('Error retrieving furniture by color: ' + error.message);
    }
};

// Retrieves furniture items filtered by material ID.
// Logs success or error.
const getFurnitureByMaterial = async (material) => {
    try {
        const result = await Furniture.find({ FurnitureMaterialID: material });
        logger.info(`Furniture retrieved by material: ${material}`);
        return result;
    } catch (error) {
        throw new Error('Error retrieving furniture by material: ' + error.message);
    }
};

// Retrieves all furniture items (store inventory) for a specific store ID.
// Validates store ID and throws errors if invalid.
// Logs success or error.
const getStoreInventory = async (storeId) => {
    if (!isValidObjectId(storeId)) {
        throw new Error('Invalid store ID');
    }
    try {
        const result = await Furniture.find({ StoreID: storeId });
        logger.info(`Furniture inventory retrieved for store ID: ${storeId}`);
        return result;
    } catch (error) {
        throw new Error('Error retrieving store inventory: ' + error.message);
    }
};

module.exports = {
    addFurniture,
    getFurnitureById,
    getAllFurniture,
    updateFurniture,
    deleteFurniture,
    getFurnitureByCategory,
    getFurnitureByColor,
    getFurnitureByMaterial,
    getStoreInventory
};
