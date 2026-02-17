const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ GET all doctors (used in patient appointment page)
router.get("/", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET doctor by ID
router.get("/:id", async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: "doctor" }).select("-password");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE doctor profile by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedData = req.body;

    const doctor = await User.findOneAndUpdate(
      { _id: req.params.id, role: "doctor" },
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.json({ message: "Profile updated successfully", doctor });
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
