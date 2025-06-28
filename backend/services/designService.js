const Design = require('../models/designs');
const User = require('../models/user');
const logger = require('../utils/logger');

// Create a new design linked to a user
// Finds user by ID, throws error if not found
// Creates a new design with designData and user ID
// Saves design, adds design ID to user's designs array, then saves user
// Logs creation and returns the design
const createDesign = async (userId, designData) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const design = new Design({ ...designData, user: userId });
    await design.save();

    user.designs.push(design._id);
    await user.save();

    logger.info(`Design created for user ${userId} with ID ${design._id}`);
    return design;
};

// Retrieve design by its ID
// Throws error if design not found
// Populates user reference and returns design document
const getDesignById = async (designId) => {
    const design = await Design.findById(designId).populate('user');
    if (!design) throw new Error('Design not found');
    return design;
};

// Update design by ID with new data
// Returns updated design or throws error if not found
const updateDesign = async (designId, designData) => {
    const design = await Design.findByIdAndUpdate(designId, designData, { new: true });
    if (!design) throw new Error('Design not found');
    return design;
};

// Delete design by ID
// Throws error if not found
// Removes design reference from user's designs array and saves user
// Returns deleted design document
const deleteDesign = async (designId) => {
    const design = await Design.findByIdAndDelete(designId);
    if (!design) throw new Error('Design not found');

    const user = await User.findById(design.user);
    user.designs.pull(design._id);
    await user.save();

    return design;
};

// Get recommended designs for a given design ID
// Throws error if design not found
// Returns populated recommendations array
const getDesignRecommendations = async (designId) => {
    const design = await Design.findById(designId).populate('recommendations');
    if (!design) throw new Error('Design not found');
    return design.recommendations;
};

// Get all designs created by a user by user ID
// Throws error if user not found
// Returns user's designs populated
const getDesignsByUser = async (userId) => {
    const user = await User.findById(userId).populate('designs');
    if (!user) throw new Error('User not found');
    return user.designs;
};

module.exports = {
    createDesign,
    getDesignById,
    updateDesign,
    deleteDesign,
    getDesignRecommendations,
    getDesignsByUser
};
