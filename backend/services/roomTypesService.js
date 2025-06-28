const RoomTypes = require('../models/roomTypes');
const { isValidObjectId } = require('../validators/objectIdValidator');
const logger = require('../utils/logger');

// Service function to get a room type by its ID
// Validates the ID and returns the room type document if found
const getRoomTypeById = async (id) => {
    if (!isValidObjectId(id)) throw new Error('Invalid room type ID');

    try {
        const roomType = await RoomTypes.findById(id);
        if (!roomType) throw new Error('Room type not found');
        logger.info('Room type retrieved successfully');
        return roomType;
    } catch (error) {
        logger.error(`Error retrieving room type by ID: ${error.message}`);
        throw new Error('Error retrieving room type by ID: ' + error.message);
    }
};

// Service function to get all room types
// Retrieves and returns all room type documents
const getAllRoomTypes = async () => {
    try {
        const roomTypes = await RoomTypes.find();
        logger.info('Room types retrieved successfully');
        return roomTypes;
    } catch (error) {
        logger.error(`Error fetching room types: ${error.message}`);
        throw new Error('Error fetching room types: ' + error.message);
    }
};

// Service function to get a room type ID by its name
// Searches for a room type document by name and returns its ID
const getRoomTypeIdByName = async (name) => {
    try {
        const roomType = await RoomTypes.findOne({ name });
        if (!roomType) throw new Error('Room type not found');
        logger.info(`Room type ID for "${name}" retrieved successfully`);
        return roomType._id;
    } catch (error) {
        logger.error(`Error retrieving room type ID by name: ${error.message}`);
        throw new Error('Error retrieving room type ID by name: ' + error.message);
    }
};

// Service function to add a new room type
// Creates and saves a new room type document using provided data
const addRoomType = async (roomTypeData) => {
    try {
        const newRoomType = new RoomTypes(roomTypeData);
        await newRoomType.save();
        logger.info('New room type added successfully');
        return newRoomType;
    } catch (error) {
        logger.error(`Error adding room type: ${error.message}`);
        throw new Error('Error adding room type: ' + error.message);
    }
};

// Service function to update an existing room type
// Validates the ID, updates the room type's name, and returns the updated document
const updateRoomType = async (roomTypeData) => {
    if (!isValidObjectId(roomTypeData.id)) throw new Error('Invalid room type ID');
    try {
        const updatedRoomType = await RoomTypes.findByIdAndUpdate(
            roomTypeData.id,
            { RoomName: roomTypeData.RoomName },
            { new: true }
        );
        if (!updatedRoomType) throw new Error('Room type not found');
        logger.info('Room type updated successfully');
        return updatedRoomType;
    } catch (error) {
        logger.error(`Error updating room type: ${error.message}`);
        throw new Error('Error updating room type: ' + error.message);
    }
};

// Service function to delete a room type by ID
// Validates the ID, deletes the room type document, and returns the deleted document
const deleteRoomType = async (id) => {
    if (!isValidObjectId(id)) throw new Error('Invalid room type ID');
    try {
        const deletedRoomType = await RoomTypes.findByIdAndDelete(id);
        if (!deletedRoomType) throw new Error('Room type not found');
        logger.info('Room type deleted successfully');
        return deletedRoomType;
    } catch (error) {
        logger.error(`Error deleting room type: ${error.message}`);
        throw new Error('Error deleting room type: ' + error.message);
    }
};

module.exports = {
    getRoomTypeById,
    getAllRoomTypes,
    getRoomTypeIdByName,
    addRoomType,
    updateRoomType,
    deleteRoomType
};
