const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ======================
// SIGNUP
// ======================
exports.signup = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    gender,
    dob,
    address,
    bloodGroup,
    medicalHistory,
    profilePic
  } = req.body;

  try {
    // Check if email already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: 'Email already in use'
      });
    }

    // Generate Custom ID
    const rolePrefix = role === "doctor" ? "d" : "p";

    const lastUser = await User.find({
      role,
      customId: { $regex: `^${rolePrefix}\\d+$` }
    })
      .sort({ customId: -1 })
      .limit(1);

    let nextNumber = 1;

    if (lastUser.length > 0) {
      const lastNumber = parseInt(lastUser[0].customId.slice(1), 10);
      nextNumber = lastNumber + 1;
    }

    const customId = `${rolePrefix}${nextNumber}`;

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // User Data
    const userData = {
      customId,
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      gender,
      dob,
      address,
      bloodGroup,
      medicalHistory,
      profilePic
    };

    // Doctor accounts start in Draft verification state
    if (role === "doctor") {
      userData.verificationStatus = "Draft";
    }

    const user = await User.create(userData);

    // JWT
    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      token,
      _id: user._id,
      customId: user.customId,
      name: user.name,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus
    });

  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Server error during signup"
    });
  }
};

// ======================
// LOGIN
// ======================
exports.login = async (req, res) => {

  const { email, password, role } = req.body;

  try {

    const user = await User.findOne({
      email,
      role
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      token,
      _id: user._id,
      customId: user.customId,
      name: user.name,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus
    });

  } catch (error) {

    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error during login"
    });

  }

};

// ======================
// LOGOUT
// ======================
exports.logout = (req, res) => {

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });

  res.json({
    message: "Logged out successfully"
  });

};