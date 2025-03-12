// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // Assuming you have auth middleware
const User = require("../models/User"); // Assuming you have a User model

// Get user profile by ID
router.get("/:id", async (req, res) => {
  try {
    // Check if id is valid
    if (!req.params.id || req.params.id === "undefined") {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(req.params.id).select("-password"); // Don't send password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error in get user profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get user suggestions (for connections, followers, etc.)
router.get("/suggestions", async (req, res) => {
  try {
    // You need to implement logic to find suggestions
    // This is just a placeholder example
    const suggestions = await User.find().select("-password").limit(5);

    res.json(suggestions);
  } catch (error) {
    console.error("Error getting user suggestions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
