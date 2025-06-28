require('dotenv').config(); // Load environment variables from .env file
const express = require('express'); // Import Express framework
const cors = require('cors'); // Import CORS middleware to handle cross-origin requests
const connectDB = require('./config/DBConfig'); // Import database connection function

// Import route handlers for various endpoints
const loginRoutes = require('./routes/loginRoutes');
const userRoutes = require('./routes/userRoutes'); 
const roomTypesRoutes = require('./routes/roomTypesRoutes'); 
const storeRoutes = require('./routes/storeRoutes');
const furnitureCategoryRoutes = require('./routes/furnitureCategoryRoutes');
const furnitureColorRoutes = require('./routes/furnitureColorRoutes'); 
const materialRoutes = require('./routes/materialRoutes'); 
const designRoutes = require('./routes/designRoutes'); 
const preferencesRoutes = require('./routes/preferencesRoutes'); 
const furnitureRoutes = require('./routes/furnitureRoutes'); 

const app = express(); // Initialize Express application

const path = require('path');
// Serve static files from the 'generated_images' directory at the '/generated_images' route
app.use('/generated_images', express.static(path.join(__dirname, 'generated_images')));

// Connect to the MongoDB database
connectDB();

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Configure CORS to allow requests from localhost:3000 with specific HTTP methods and credentials
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Define routes for different parts of the API
app.use('/api/auth', loginRoutes); // Authentication routes
app.use('/api/user', userRoutes); // User-related routes
app.use('/api/room', roomTypesRoutes); // Room types routes
app.use('/api/store', storeRoutes); // Store-related routes
app.use('/api/furniture', furnitureCategoryRoutes); // Furniture category routes
app.use('/api/furniture-color', furnitureColorRoutes); // Furniture color routes
app.use('/api/material', materialRoutes); // Material routes
app.use('/api/designs', designRoutes); // Design routes
app.use('/api/preferences', preferencesRoutes); // Preferences routes
app.use('/api/furnitures', furnitureRoutes); // Furniture routes

// Start the server and listen on port 3001
app.listen(3001, () => {
    console.log('Server running on port 3001');
});
