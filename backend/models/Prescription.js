const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  medicine: { type: String, required: true },
  dosage: { type: Number, required: true },
  mealTiming: { type: String, enum: ['before meal', 'after meal'], required: true },
  duration: { type: String, required: true },
});

const PrescriptionSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicines: [MedicineSchema],
  dosageInstructions: { type: String },
  contactInfo: { type: String },
  additionalNotes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);
