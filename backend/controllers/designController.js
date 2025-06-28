const express = require('express');
const designService = require('../services/designService');
const logger = require('../utils/logger');
const { isValidObjectId } = require('../validators/objectIdValidator');
const { validateRequest } = require('../utils/validation');
const { handleServiceCall } = require('../utils/handleServiceCall');
const Joi = require('joi');
const router = express.Router();

// Joi schema for validating design creation and update requests
const designValidationSchema = Joi.object({
    name: Joi.string().min(3).required(),        // Design name required, min length 3
    description: Joi.string().optional(),        // Optional description string
    materials: Joi.array().items(Joi.string()).optional(),  // Optional array of material strings
    furniture: Joi.array().items(Joi.string()).optional(),  // Optional array of furniture strings
    layout: Joi.object().required(),              // Layout object required
});

// Controller to create a new design, validating input and calling service
const createDesign = (req, res) => {
    const userId = req.user.id;  // Get userId from authenticated request
    try {
        validateRequest(designValidationSchema, req.body);  // Validate request body against schema
        // Call designService to create design, passing userId and design data
        handleServiceCall(designService.createDesign, res, userId, req.body);
    } catch (error) {
        res.status(400).json({ message: error.message });  // Return validation errors if any
    }
};

// Controller to get a design by its ID, validating the ID first
const getDesignById = (req, res) => {
    const designId = req.params.id;
    if (!isValidObjectId(designId))  // Check if designId is a valid MongoDB ObjectId
        return res.status(400).json({ message: "Invalid Design ID" });
    // Call service to retrieve the design by ID
    handleServiceCall(designService.getDesignById, res, designId);
};

// Controller to update a design, validating designId and request body
const updateDesign = (req, res) => {
    const designId = req.params.id;
    if (!isValidObjectId(designId))  // Validate designId format
        return res.status(400).json({ message: "Invalid Design ID" });

    try {
        validateRequest(designValidationSchema, req.body);  // Validate updated data
        // Call service to update design with given ID and new data
        handleServiceCall(designService.updateDesign, res, designId, req.body);
    } catch (error) {
        res.status(400).json({ message: error.message });  // Return validation errors if any
    }
};

// Controller to delete a design by ID after validating the ID
const deleteDesign = (req, res) => {
    const designId = req.params.id;
    if (!isValidObjectId(designId))  // Validate designId
        return res.status(400).json({ message: "Invalid Design ID" });
    // Call service to delete design by ID
    handleServiceCall(designService.deleteDesign, res, designId);
};

// Controller to get recommended designs related to a given design ID
const getDesignRecommendations = (req, res) => {
    // Calls service to get recommendations based on design ID in URL params
    handleServiceCall(designService.getDesignRecommendations, res, req.params.id);
};

// Controller to get all designs created by the authenticated user
const getDesignsByUser = (req, res) => {
    const userId = req.user.id;  // Extract userId from authenticated request
    // Call service to retrieve all designs by this user
    handleServiceCall(designService.getDesignsByUser, res, userId);
};

module.exports = {
    createDesign,
    getDesignById,
    updateDesign,
    deleteDesign,
    getDesignRecommendations,
    getDesignsByUser
};
