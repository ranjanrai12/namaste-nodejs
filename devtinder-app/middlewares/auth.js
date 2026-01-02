const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    // get the token from cookies
    const { token } = req.cookies;

    // If token is not present, return 401 Unauthorized
    if (!token) {
      const err = new Error("Access denied. No token provided.");
      err.statusCode = 401;
      throw err;
    }
    // Verify the token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        const error = new Error("Session expired. Please log in again.");
        error.statusCode = 401;
        throw error;
      } else if (err.name === "JsonWebTokenError") {
        const error = new Error("Invalid token. Please log in again.");
        error.statusCode = 401;
        throw error;
      } else {
        const error = new Error("Token verification failed.");
        error.statusCode = 401;
        throw error;
      }
    }

    // Extract the user ID from the decoded token
    const { _id } = decodedToken;

    // Check if user exists in the database
    const user = await User.findById(_id);
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  userAuth,
};
