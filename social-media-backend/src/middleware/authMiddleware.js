const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    console.log("Auth Header Received:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Missing or malformed authorization header");
      return res
        .status(401)
        .json({ message: "Access Denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token);

    if (!token) {
      console.error("Token is missing after extraction");
      return res.status(401).json({ message: "Token is missing." });
    }

    // Verify Token using async/await
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          console.error("Token expired at:", err.expiredAt);
          return res
            .status(401)
            .json({ message: "Token expired. Please log in again." });
        } else {
          console.error("Token verification failed:", err.message);
          return res
            .status(403)
            .json({ message: "Invalid token", error: err.message });
        }
      }

      console.log("Decoded Token:", decoded);
      req.user = decoded; // Attach user data to the request object
      next(); // Proceed to the next middleware
    });
  } catch (error) {
    console.error("Unexpected error in authMiddleware:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = authMiddleware;
