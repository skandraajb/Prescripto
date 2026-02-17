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

// SIGNUP
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
    // Check if email already registered
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already in use' });

    // Generate customId based on role prefix
    const rolePrefix = role === 'doctor' ? 'd' : 'p';

    // Find user with highest customId number for this role
    const lastUser = await User.find({ 
      role, 
      customId: { $regex: `^${rolePrefix}\\d+$` }
    })
    .sort({ customId: -1 })
    .limit(1);

    let nextNumber = 1;
    if (lastUser.length > 0) {
      const lastCustomId = lastUser[0].customId;
      const lastNumber = parseInt(lastCustomId.slice(1), 10);
      nextNumber = lastNumber + 1;
    }

    const customId = `${rolePrefix}${nextNumber}`;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user document
    const user = await User.create({
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
    });

    // Generate JWT token
    const token = generateToken(user);

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send user info (exclude password)
    res.status(201).json({
      _id: user._id,
      customId: user.customId,
      name: user.name,
      email: user.email,
      role: user.role,
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Find user by email and role
    const user = await User.findOne({ email, role });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    // Generate JWT token
    const token = generateToken(user);

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send user info AND token (fix added here)
    res.json({
      token,   // <--- added token here for frontend use
      _id: user._id,
      customId: user.customId,
      name: user.name,
      email: user.email,
      role: user.role,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// LOGOUT
exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.json({ message: 'Logged out successfully' });
};
