const Prescription = require('../models/Prescription');

// Doctor creates a new prescription
exports.createPrescription = async (req, res) => {
  try {
    const { patientId, medicines, dosageInstructions, contactInfo, additionalNotes } = req.body;
    const doctorId = req.user._id; // from auth middleware

    console.log('Received data:', {
      patientId,
      medicines,
      dosageInstructions,
      contactInfo,
      additionalNotes,
      doctorId,
    });

    if (!patientId || patientId.length !== 24) {
      return res.status(400).json({ message: 'Invalid patient ID format' });
    }

    if (!Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({ message: 'Medicines must be a non-empty array' });
    }

    for (const med of medicines) {
      if (
        !med.medicine ||
        typeof med.medicine !== 'string' ||
        !med.dosage ||
        typeof med.dosage !== 'number' ||
        med.dosage <= 0 ||
        !['before meal', 'after meal'].includes(med.mealTiming) ||
        !med.duration
      ) {
        return res.status(400).json({ message: 'Invalid medicine entry detected' });
      }
    }

    const newPrescription = new Prescription({
      doctor: doctorId,
      patient: patientId,
      medicines,
      dosageInstructions,
      contactInfo,
      additionalNotes,
    });

    await newPrescription.save();
    res.status(201).json(newPrescription);
  } catch (error) {
    console.error('Create Prescription Error:', error);
    res.status(500).json({ message: 'Failed to create prescription', error: error.message });
  }
};

// Get all prescriptions by logged-in doctor
exports.getPrescriptionsForDoctor = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const prescriptions = await Prescription.find({ doctor: doctorId })
      .populate('patient', 'customId name');
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch prescriptions', error: error.message });
  }
};

// Get all prescriptions by logged-in patient
exports.getPrescriptionsForPatient = async (req, res) => {
  try {
    const patientId = req.user._id;
    const prescriptions = await Prescription.find({ patient: patientId })
      .populate('doctor', 'name contactInfo')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    console.error('Failed to fetch prescriptions for patient:', error);
    res.status(500).json({ message: 'Failed to fetch prescriptions for patient', error: error.message });
  }
};

// Delete a prescription (optional)
exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });

    // Only doctor who created can delete
    if (prescription.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this prescription' });
    }

    await prescription.deleteOne();
    res.json({ message: 'Prescription deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete prescription', error: error.message });
  }
};

// Get prescription details by ID
exports.getPrescriptionById = async (req, res) => {
  try {
    console.log("Fetching prescription with id:", req.params.id);
    const prescription = await Prescription.findById(req.params.id)
      .populate('doctor', 'name contactInfo')
      .populate('patient', 'name customId');

    if (!prescription) {
      console.log("Prescription not found");
      return res.status(404).json({ message: 'Prescription not found' });
    }

    console.log("Found prescription:", prescription);
    res.json(prescription);
  } catch (error) {
    console.error("Server error in getPrescriptionById:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
