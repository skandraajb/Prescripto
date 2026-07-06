const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {

  let token;

  console.log("\n========== AUTH ==========");
  console.log("Authorization Header:", req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  console.log("Extracted Token:", token);

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token"
    });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded);

    const user = await User.findById(decoded.id).select("-password");

    console.log("User Found:", user ? user.email : "No user");

    if (!user) {
      return res.status(401).json({
        message: "Not authorized, user not found"
      });
    }

    req.user = user;

    next();

  } catch (error) {

    console.log("JWT ERROR:", error);

    return res.status(401).json({
      message: "Not authorized, token failed"
    });

  }

};