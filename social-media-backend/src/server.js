const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
require("dotenv").config();
const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());

// Important: These middleware should come BEFORE your routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Add a test route to verify the server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Add a test route for POST requests
app.post('/api/test-post', (req, res) => {
  console.log('Test POST received');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  res.json({ 
    message: 'Test POST received',
    receivedBody: req.body
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", require('./routes/userRoutes'));
app.use("/api/posts", postRoutes);

// Connect to Database
connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err);
  
  // Send a JSON response even for server errors
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: err.message 
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));