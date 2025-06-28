const Material = require('../models/materials');
const logger = require('../utils/logger');
const { isValidObjectId } = require('../validators/objectIdValidator');

// Service function to add a material
// Takes materialData object, creates a new Material document in DB, logs success or error, and returns the created material
const addMaterial = async (materialData) => {
    try {
        const material = await Material.create(materialData);
        logger.info('Material added successfully: ' + material._id);
        return material;
    } catch (error) {
        logger.error('Error adding material: ' + error.message);
        throw new Error('Error adding material: ' + error.message);
    }
};

// Service function to get a material by ID
// Validates the ID, fetches material by ID from DB, logs success or error, returns the found material or throws error if not found
const getMaterialById = async (id) => {
    if (!isValidObjectId(id)) throw new Error('Invalid material ID');
    try {
        const material = await Material.findById(id);
        if (!material) throw new Error('Material not found');
        logger.info('Material retrieved successfully: ' + id);
        return material;
    } catch (error) {
        logger.error('Error retrieving material by ID: ' + error.message);
        throw new Error('Error retrieving material by ID: ' + error.message);
    }
};

// Service function to get all materials
// Fetches all materials from DB, logs success or error, returns the array of materials
const getAllMaterials = async () => {
    try {
        const materials = await Material.find();
        logger.info('All materials retrieved successfully');
        return materials;
    } catch (error) {
        logger.error('Error fetching all materials: ' + error.message);
        throw new Error('Error fetching all materials: ' + error.message);
    }
};

// Service function to update a material by ID
// Validates ID, updates material document with provided materialData, logs success or error, returns updated material or throws error if not found
const updateMaterial = async (id, materialData) => {
    if (!isValidObjectId(id)) throw new Error('Invalid material ID');
    try {
        const material = await Material.findByIdAndUpdate(id, materialData, { new: true });
        if (!material) throw new Error('Material not found');
        logger.info('Material updated successfully: ' + id);
        return material;
    } catch (error) {
        logger.error('Error updating material: ' + error.message);
        throw new Error('Error updating material: ' + error.message);
    }
};

// Service function to delete a material by ID
// Validates ID, deletes material document by ID, logs success or error, returns true if deleted or throws error if not found
const deleteMaterial = async (id) => {
    if (!isValidObjectId(id)) throw new Error('Invalid material ID');
    try {
        const material = await Material.findByIdAndDelete(id);
        if (!material) throw new Error('Material not found');
        logger.info('Material deleted successfully: ' + id);
        return true;
    } catch (error) {
        logger.error('Error deleting material: ' + error.message);
        throw new Error('Error deleting material: ' + error.message);
    }
};

// Service function to get materials by type
// Queries DB for materials with a specific MaterialType, logs success or error, returns array of materials matching the type
const getMaterialsByType = async (type) => {
    try {
        // Note: using the model field "MaterialType"
        const materials = await Material.find({ MaterialType: type });
        logger.info(`Materials of type ${type} retrieved successfully`);
        return materials;
    } catch (error) {
        logger.error('Error fetching materials by type: ' + error.message);
        throw new Error('Error fetching materials by type: ' + error.message);
    }
};

module.exports = {
    addMaterial,
    getMaterialById,
    getAllMaterials,
    updateMaterial,
    deleteMaterial,
    getMaterialsByType
};
