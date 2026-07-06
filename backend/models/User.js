const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  customId: { type: String, unique: true }, // 👈 Human-readable ID like p1, d2, etc.
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor'], required: true },
  phone: String,
  gender: String,
  dob: String,
  address: String,
  bloodGroup: String,
  medicalHistory: String,
  profilePic: String,
  location: String,

  // Verification
  verificationStatus: {
    type: String,
    enum: ["Draft", "Submitted", "Approved", "Rejected"],
    default: null
  },

  serviceNowRequestId: {
    type: String,
    default: null
  },

  rejectionReason: {
    type: String,
    default: ""
  },
  verifiedAt: {
    type: Date,
    default: null
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
