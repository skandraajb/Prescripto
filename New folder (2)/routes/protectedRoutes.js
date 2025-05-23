const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.get('/protected-route', protect, (req, res) => {
  res.json({ message: `Hello ${req.user.name}, you accessed protected data!` });
});

module.exports = router;
