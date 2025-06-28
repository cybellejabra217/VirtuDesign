const logger = require('../utils/logger');

const handleServiceCall = async (serviceFunction, res, ...args) => {
    try {
        // Call the service function with provided arguments and await the result
        const result = await serviceFunction(...args);
        // Send a 200 response with the result in JSON format
        res.status(200).json(result);
    } catch (error) {
        // Log the error details including stack trace and input arguments
        logger.error(`Error in ${serviceFunction.name}: ${error.message}`, {
            stack: error.stack,
            args
        });
        // Send a 400 response with error message
        res.status(400).json({ message: error.message });
    }
};

module.exports = { handleServiceCall };
