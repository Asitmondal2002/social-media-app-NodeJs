const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const userId = req.user.id; // Getting logged-in user ID

    if (!content) {
      return res.status(400).json({ message: "Post content is required" });
    }

    const post = new Post({
      content,
      image,
      user: userId,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error("Post creation error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
