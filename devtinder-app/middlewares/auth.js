const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    // get the token from cookies
    const { token } = req.cookies;

    // If token is not present, return 401 Unauthorized
    if (!token) {
      return res
        .status(401)
        .json({ errorCode: 401, message: "Access denied. No token provided." });
    }
    // Verify the token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      switch (err.name) {
        case "TokenExpiredError":
          return res.status(401).json({
            errorCode: 401,
            message: "Session expired. Please log in again.",
          });
        case "JsonWebTokenError":
          return res.status(401).json({
            errorCode: 401,
            message: "Invalid token. Please log in again.",
          });
        default:
          return res
            .status(400)
            .json({ errorCode: 401, message: "Token verification failed." });
      }
    }

    // Extract the user ID from the decoded token
    const { _id } = decodedToken;

    // Check if user exists in the database
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).send("Error " + err.message);
  }
};

module.exports = {
  userAuth,
};
