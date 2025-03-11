const express = require("express");
const router = express.Router();
const Post = require("../models/Post"); // Assuming you have a Post model
const authMiddleware = require("../middleware/authMiddleware"); // Ensure authentication
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    // Create a unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create a multer instance without applying it yet
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: fileFilter
});

// Test route to verify the router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Posts router is working!' });
});

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
    const posts = await Post.find()
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture')
      .sort({ createdAt: -1 });
    
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// Create post route - handles both JSON and multipart/form-data
router.post('/', authMiddleware, (req, res, next) => {
  console.log('POST request received');
  console.log('Content-Type:', req.headers['content-type']);
  
  // Check if it's a multipart/form-data request (has image)
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    console.log('Processing multipart request with image');
    
    upload.single('image')(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      }
      
      console.log('After multer:');
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      
      // Check for content
      if (!req.body || !req.body.content) {
        console.log('Content missing in form data');
        return res.status(400).json({ message: 'Post content is required' });
      }

      try {
        const newPost = new Post({
          content: req.body.content,
          user: req.user.id,
          image: req.file ? `/uploads/${req.file.filename}` : ''
        });

        console.log('Creating post with content and image:', {
          content: newPost.content,
          image: newPost.image
        });
        
        const savedPost = await newPost.save();
        const populatedPost = await Post.findById(savedPost._id).populate('user', 'username profilePicture');
        
        console.log('Post created successfully with ID:', savedPost._id);
        res.status(201).json(populatedPost);
      } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Failed to create post', error: error.message });
      }
    });
  } else {
    // It's a JSON request (no image)
    console.log('Processing JSON request without image');
    console.log('Request body:', req.body);
    
    // Process JSON request
    if (!req.body || !req.body.content) {
      console.log('Content missing in JSON');
      return res.status(400).json({ message: 'Post content is required' });
    }

    const createJsonPost = async () => {
      try {
        const newPost = new Post({
          content: req.body.content,
          user: req.user.id
        });

        console.log('Creating post with content:', newPost.content);
        const savedPost = await newPost.save();
        const populatedPost = await Post.findById(savedPost._id).populate('user', 'username profilePicture');
        
        console.log('Post created successfully with ID:', savedPost._id);
        res.status(201).json(populatedPost);
      } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Failed to create post', error: error.message });
      }
    };

    createJsonPost();
  }
});

// Like a post
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user already liked the post
    const alreadyLiked = post.likes.includes(userId);
    
    if (alreadyLiked) {
      // Unlike the post
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      // Like the post
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ 
      likes: post.likes.length, 
      liked: !alreadyLiked,
      message: alreadyLiked ? 'Post unliked' : 'Post liked'
    });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Failed to like post' });
  }
});

// Add a comment to a post
router.post('/:id/comment', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      user: userId,
      text: text.trim(),
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    // Populate the user data for the new comment
    const populatedPost = await Post.findById(postId)
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

// Get a single post by ID
router.get('/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    
    const post = await Post.findById(postId)
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture');
      
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
});

module.exports = router;

