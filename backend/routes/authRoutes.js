const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { getUserProfile } = require('../controllers/userController');  // you will create this file

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// NEW route to get logged-in user profile
router.get('/profile', protect, getUserProfile);

module.exports = router;
