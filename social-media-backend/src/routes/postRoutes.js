const express = require("express");
const router = express.Router();
const Post = require("../models/Post"); // Assuming you have a Post model
const authMiddleware = require("../middleware/authMiddleware"); // Ensure authentication

// Dummy posts data (Remove this when using MongoDB)
const posts = [
  {
    id: 1,
    content: "Hello World!",
    user: { id: 1, name: "John Doe", avatar: "/default-avatar.png" },
    likes: 10,
    comments: 5,
  },
  {
    id: 2,
    content: "This is my second post!",
    user: { id: 2, name: "Jane Doe", avatar: "/default-avatar.png" },
    likes: 7,
    comments: 3,
  },
];

// ✅ GET all posts
router.get("/", async (req, res) => {
  try {
    const allPosts = await Post.find().populate(
      "user",
      "username profilePicture"
    );
    res.json(allPosts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// ✅ CREATE new post
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Post content is required" });
    }

    const newPost = new Post({
      content,
      user: req.user.id, // Assuming `authMiddleware` sets `req.user`
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Post creation error:", error);
    res
      .status(500)
      .json({ message: "Failed to create post. Please try again." });
  }
});

module.exports = router;
