require('dotenv').config();
const mongoose = require('mongoose');

const dbUri = process.env.DB_HOST;  // Get MongoDB URI from environment variables

// Exit if no MongoDB URI is provided in env variables
if (!dbUri) {
    console.error("No MongoDB URI found in environment variables! Exiting...");
    process.exit(1);
}

// Async function to connect to MongoDB using mongoose
const connectDB = async () => {
    try {
        // Connect to MongoDB with recommended options
        await mongoose.connect(dbUri, { 
            useNewUrlParser: true,      // Use new URL parser
            useUnifiedTopology: true    // Use new Server Discover and Monitoring engine
        });
        console.log("MongoDB connected successfully.");  // Success log
    } catch (err) {
        // Log error and exit if connection fails
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
};

module.exports = connectDB;  // Export connectDB function for use in app
