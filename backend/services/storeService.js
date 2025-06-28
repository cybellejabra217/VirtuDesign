const Store = require('../models/stores');
const { isValidObjectId } = require('../validators/objectIdValidator');
const logger = require('../utils/logger');

// Add Store (formerly createStore)
// storeData: object containing the store fields to create
// Returns the newly created store document
const addStore = async (storeData) => {
    try {
        const result = await Store.create(storeData);
        logger.info(`Store added with ID ${result._id}`);
        return result;
    } catch (error) {
        logger.error(`Error adding store: ${error.message}`);
        throw new Error('Error adding store: ' + error.message);
    }
};

// Get Store by ID (now gets store name and ID)
// storeId: string MongoDB ObjectId of the store
// Validates ID, fetches store, returns an object with id and StoreName
const getStoreNameById = async (storeId) => {
    if (!isValidObjectId(storeId)) {
        throw new Error('Invalid store ID');
    }

    try {
        const store = await Store.findById(storeId);
        if (!store) {
            throw new Error('Store not found');
        }
        logger.info(`Store retrieved with ID ${storeId}`);
        return { id: store._id, name: store.StoreName };
    } catch (error) {
        logger.error(`Error retrieving store by ID: ${error.message}`);
        throw new Error('Error retrieving store by ID: ' + error.message);
    }
};

// Get Store ID by Name (new function to get store ID by name)
// storeName: string name of the store to look up
// Returns the store's ObjectId if found
const getStoreIdByName = async (storeName) => {
    try {
        const store = await Store.findOne({ StoreName: storeName });
        if (!store) {
            throw new Error('Store not found');
        }
        logger.info(`Store ID retrieved for store name: ${storeName}`);
        return store._id;
    } catch (error) {
        logger.error(`Error retrieving store ID by name: ${error.message}`);
        throw new Error('Error retrieving store ID by name: ' + error.message);
    }
};

// Get Stores by Location (using geolocation)
// location: [longitude, latitude] array representing the center point
// Returns stores within a 1 mile radius (adjust radius as needed)
const getStoresByLocation = async (location) => {
    try {
        const stores = await Store.find({
            Location: {
                $geoWithin: {
                    $centerSphere: [location, 1 / 3963.2] // 1 mile radius on Earth's sphere
                }
            }
        });

        logger.info(`Stores retrieved by location: ${location}`);
        return stores;
    } catch (error) {
        logger.error(`Error retrieving stores by location: ${error.message}`);
        throw new Error('Error retrieving stores by location: ' + error.message);
    }
};

// Update Store (keeping this functionality)
// storeId: string MongoDB ObjectId of store to update
// updateData: object containing fields to update
// Returns the updated store document
const updateStore = async (storeId, updateData) => {
    if (!isValidObjectId(storeId)) {
        throw new Error('Invalid store ID');
    }

    try {
        const updatedStore = await Store.findByIdAndUpdate(storeId, updateData, { new: true });
        if (!updatedStore) {
            throw new Error('Store not found');
        }
        logger.info(`Store updated with ID ${storeId}`);
        return updatedStore;
    } catch (error) {
        logger.error(`Error updating store: ${error.message}`);
        throw new Error('Error updating store: ' + error.message);
    }
};

// Delete Store
// storeId: string MongoDB ObjectId of store to delete
// Returns true if successful
const deleteStore = async (storeId) => {
    if (!isValidObjectId(storeId)) {
        throw new Error('Invalid store ID');
    }

    try {
        const deletedStore = await Store.findByIdAndDelete(storeId);
        if (!deletedStore) {
            throw new Error('Store not found');
        }
        logger.info(`Store deleted with ID ${storeId}`);
        return true;
    } catch (error) {
        logger.error(`Error deleting store: ${error.message}`);
        throw new Error('Error deleting store: ' + error.message);
    }
};

// Get All Stores
// Returns an array of all store documents
const getAllStores = async () => {
    try {
        const stores = await Store.find({});
        logger.info('All stores retrieved');
        return stores;
    } catch (error) {
        logger.error(`Error retrieving all stores: ${error.message}`);
        throw new Error('Error retrieving all stores: ' + error.message);
    }
};

module.exports = {
    addStore,
    getStoreNameById,
    getStoreIdByName, // Exporting the new method
    getStoresByLocation,
    updateStore,
    deleteStore,
    getAllStores
};
