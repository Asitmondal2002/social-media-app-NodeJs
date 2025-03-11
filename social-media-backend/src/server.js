const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes"); // ✅ Import post routes
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded" : "Not Loaded");


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes); // ✅ Add post routes

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
