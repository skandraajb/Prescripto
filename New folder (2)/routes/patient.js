// routes/patientRoutes.js (or add to your existing routes)

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// GET patient by customId
router.get('/search/:customId', protect, async (req, res) => {
  try {
    const patient = await User.findOne({ customId: req.params.customId, role: 'patient' });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
