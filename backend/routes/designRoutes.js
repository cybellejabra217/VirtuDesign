const express = require("express"); // Import Express framework
const router = express.Router(); // Create a router instance
const multer = require("multer"); // Import multer for handling file uploads
const fs = require("fs"); // File system module for file operations
const FormData = require("form-data"); // Import FormData to handle multipart/form-data requests
const axios = require("axios"); // HTTP client for API requests
const path = require("path"); // Module for handling file and directory paths
const { OpenAI } = require("openai"); // Import OpenAI client
const jwt = require("jsonwebtoken"); // JSON Web Token for authentication
const upload = multer({ dest: "./uploads/" }); // Configure multer to save uploads to './uploads/' directory
const Furniture = require("../models/furniture"); // Import Furniture model
const UserPreferences = require("../models/preferences"); // Import UserPreferences model
const FurnitureColors = require("../models/furnitureColors"); // Import FurnitureColors model
const Design = require("../models/designs"); // Import Design model
const Recommendations = require("../models/recommendations"); // Import Recommendations model
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Initialize OpenAI client with API key from environment variables
});

router.post("/", upload.array("images", 1), async (req, res) => {
  // POST route to generate design image, accepting up to 1 uploaded image
  const images = req.files; // Retrieve uploaded images from request
  try {
    console.log(req.body.roomType); // Log the room type from request body
    if (images.length === 0) {
      // Validate presence of at least one image
      return res.status(400).json({ error: "At least one image is required." });
    }
    if (!req.body.roomType || req.body.roomType.trim() === "") {
      // Validate presence and non-empty room type
      return res
        .status(400)
        .json({ error: "Room type is required and cannot be empty." });
    }

    const RoomTypeID = req.body.roomType; // Extract RoomTypeID from request body
    const authHeader = req.headers.authorization; // Extract Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // Validate Authorization header format
      return res
        .status(401)
        .json({ error: "Authorization header is missing or invalid" });
    }
    const token = authHeader.split(" ")[1]; // Extract JWT token from header
    const decodedToken = jwt.decode(token); // Decode token payload without verification
    const UserID = decodedToken?.userId; // Extract userId from decoded token
    if (!UserID) {
      // Check if userId exists in token
      return res.status(401).json({ error: "Invalid token: UserID not found" });
    }

    // Fetch user preferences based on userId
    const userPreferences = await UserPreferences.findOne({ UserID }).exec();
    let userColorPreference = null;
    let vibePreference = null;
    if (userPreferences) {
      userColorPreference = userPreferences.ColorPreferences; // Get user's color preference
      if (userColorPreference) {
        // If color preference exists, find corresponding FurnitureColors document
        const color = await FurnitureColors.findOne({
          ColorTone: userColorPreference,
        }).exec();
        userColorPreference = color ? color._id : null; // Use color _id if found, else null
      }
      vibePreference = userPreferences.VibePreference; // Get user's vibe preference
    }

    const FurniturePrice = req.body.price || 10000000000000000000; // Default furniture price if not specified

    const FutureColorID = userColorPreference || null; // Use user color preference or null
    const query = { RoomTypeID, FurniturePrice: { $lt: FurniturePrice } }; // Query furniture by room type and price less than budget
    if (FutureColorID) {
      query.FurnitureColorID = FutureColorID; // Add color filter if specified
    }
    const furnitureItems = await Furniture.find(query).exec(); // Fetch matching furniture items from DB
    if (!furnitureItems || furnitureItems.length === 0) {
      // Return error if no furniture matches query
      return res
        .status(404)
        .json({
          error:
            "No furniture items found for the specified room and furniture type.",
          FutureColorID: FutureColorID,
        });
    }

    // Pick a random furniture item from results
    const randomFurnitureItem =
      furnitureItems[Math.floor(Math.random() * furnitureItems.length)];
    // Create prompt string for image generation
    const prompt =
      "Merge room with " +
      randomFurnitureItem.FurnitureName +
      " with schema " +
      (vibePreference ? vibePreference : "");

    if (!images || images.length === 0) {
      // Double check images exist
      return res.status(400).json({ error: "At least one image is required." });
    }

    userId = decodedToken?.userId; // Re-extract userId for consistency
    if (!userId) {
      return res.status(401).json({ error: "Invalid token: userId not found" });
    }

    console.log("User ID:", userId); // Log user ID
    const form = new FormData(); // Create new FormData instance for request
    form.append("prompt", prompt); // Append prompt text to form
    form.append("n", 1); // Request 1 generated image
    form.append("size", "1024x1024"); // Set image size
    form.append("model", "gpt-image-1"); // Specify model for image editing

    // Append each uploaded image file as stream to form-data
    images.forEach((image, index) => {
      form.append(`image[${index}]`, fs.createReadStream(image.path), {
        filename: path.basename(image.path),
        contentType: "image/png",
      });
    });

    const imageUrl = randomFurnitureItem.FurniturePicture; // URL of furniture image for reference

    // Append furniture images from DB to form-data as streams
    for (let i = 0; i < furnitureItems.length; i++) {
      const furnitureImageUrl = furnitureItems[i].FurniturePicture;
      if (furnitureImageUrl) {
        try {
          const furnitureImageResponse = await axios.get(furnitureImageUrl, { responseType: "stream" });
          form.append(`image[${images.length + i}]`, furnitureImageResponse.data, {
            filename: `furniture-image-${i}.jpeg`,
            contentType: "image/jpeg",
          });
        } catch (error) {
          // Log warning if furniture image could not be loaded
          console.warn(`Failed to load furniture image at index ${i}:`, error.message);
        }
      }
    }
    const onlineImageIndex = images.length; // Index for online furniture images in form-data

    // The commented block below was for adding an online image (currently disabled)
    // const responseimage = await axios.get(imageUrl, { responseType: "stream" });
    // form.append(`image[${onlineImageIndex}]`, responseimage.data, {
    //   filename: "online-image.jpeg",
    //   contentType: "image/jpeg",
    // });

    // Send POST request to OpenAI image edits endpoint with form data
    const response = await axios.post(
      "https://api.openai.com/v1/images/edits",
      form,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Auth header with API key
          ...form.getHeaders(), // Append multipart/form-data headers
        },
      }
    );
    console.log("Response:", response.data); // Log response from OpenAI API
    const generatedImageBase64 = response?.data?.data?.[0]?.b64_json; // Extract generated image base64 from response

    if (!generatedImageBase64) {
      // Return error if image generation failed
      return res.status(500).json({ error: "Failed to generate image" });
    }

    // Define output directory path for saving generated images for the user
    const outputDir = path.join(
      __dirname,
      "../generated_images",
      userId.toString()
    );
    // Define full output file path with timestamped filename
    const outputFilePath = path.join(
      outputDir,
      `generated_image_${Date.now()}.png`
    );

    fs.mkdirSync(outputDir, { recursive: true }); // Create output directory if not existing
    fs.writeFileSync(
      outputFilePath,
      Buffer.from(generatedImageBase64, "base64") // Write base64 decoded image buffer to file
    );

    // Create a new Recommendations document with relevant fields
    const newRecommendation = new Recommendations({
      UserID: userId,
      FurnitureRecommendations: randomFurnitureItem._id,
      MaterialRecommendations: randomFurnitureItem.FurnitureMaterialID,
    });

    // Create a new Design document linking generated image and related metadata
    const newDesign = new Design({
      UserID: userId,
      RoomTypeID: RoomTypeID,
      DesignImage: `/generated_images/${userId}/${path.basename(
        outputFilePath
      )}`, // Relative path to saved design image
      FurnitureID: randomFurnitureItem._id,
      VibePreference: vibePreference || null,
      ColorPreferences: userColorPreference || null,
      FurnitureUsedID: randomFurnitureItem._id,
      MaterialsUsedID: randomFurnitureItem.FurnitureMaterialID,
      RecommendationID: newRecommendation._id,
      RoomType: req.body.roomType || "Living Room",
      Budget: FurniturePrice,
      CreatedBy: userId,
      ModelURL: `/generated_images/${userId}/${path.basename(outputFilePath)}`, // URL for model image
    });

    await newRecommendation.save(); // Save recommendation to database

    await newDesign.save(); // Save design to database
    res.json({
      imageUrl: `/generated_images/${userId}/${path.basename(outputFilePath)}`, // Return URL of generated image
    });
  } catch (err) {
    // Catch any errors and log response data or error object
    console.error(err?.response?.data || err);
    res.status(500).json({ error: "Image generation failed" }); // Send 500 error response
  } finally {
    // Clean up uploaded files from server after processing
    images.forEach((image) => fs.unlinkSync(image.path));
  }
});

router.get("/", async (req, res) => {
  // GET route to fetch all designs created by authenticated user
  const authHeader = req.headers.authorization; // Extract Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Validate Authorization header
    return res
      .status(401)
      .json({ error: "Authorization header is missing or invalid" });
  }
  const token = authHeader.split(" ")[1]; // Extract JWT token
  const decodedToken = jwt.decode(token); // Decode token payload
  const UserID = decodedToken?.userId; // Extract userId
  if (!UserID) {
    // Validate userId presence
    return res.status(401).json({ error: "Invalid token: UserID not found" });
  }

  try {
    // Query database for designs created by this user, populating referenced documents
    const designs = await Design.find({ CreatedBy: UserID })
      .populate("FurnitureUsedID")
      .populate("MaterialsUsedID")
      .populate("RecommendationID")
      .exec();
    res.json(designs); // Send designs as JSON response
  } catch (err) {
    console.error(err); // Log any error
    res.status(500).json({ error: "Failed to fetch designs" }); // Send error response
  }
});

router.get("/search", async (req, res) => {
  // GET route to search all designs in database (public or internal search)
  const authHeader = req.headers.authorization; // Extract Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Validate Authorization header
    return res
      .status(401)
      .json({ error: "Authorization header is missing or invalid" });
  }

  try {
    // Find all designs and populate related references
    const designs = await Design.find()
      .populate("FurnitureUsedID")
      .populate("MaterialsUsedID")
      .populate("RecommendationID")
      .exec();

    // Further populate nested StoreID within FurnitureUsedID documents
    res.json(await Design.populate(designs, {
        path: "FurnitureUsedID.StoreID",
      }));
  } catch (err) {
    console.error(err); // Log any error
    res.status(500).json({ error: "Failed to fetch designs" }); // Send error response
  }
});

module.exports = router; // Export router to be used by Express app
