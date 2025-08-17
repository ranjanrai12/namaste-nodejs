const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    // get the token from cookies
    const { token } = req.cookies;

    // If token is not present, return 401 Unauthorized
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }
    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
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
