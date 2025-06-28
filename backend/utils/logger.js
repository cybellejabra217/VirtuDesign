const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    level: 'info', // Minimum level to log: info and above (warn, error, etc.)
    format: format.combine(
        format.timestamp({ // Add timestamps to logs
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }), // Include stack trace on errors
        format.splat(), // Enable string interpolation
        format.json() // Output logs in JSON format
    ),
    defaultMeta: { service: 'user-service' }, // Default metadata added to all logs
    transports: [
        new transports.File({ filename: 'error.log', level: 'error' }), // Errors go to error.log
        new transports.File({ filename: 'combined.log' }) // All logs go to combined.log
    ]
});

// During development (not production), also log to console with colors and simple format
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(), // Colorize console output
            format.simple() // Simple readable format
        )
    }));
}

module.exports = logger;
