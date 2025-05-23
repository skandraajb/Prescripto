const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, prescriptionController.createPrescription);
router.get('/doctor', protect, prescriptionController.getPrescriptionsForDoctor);
router.get('/', protect, prescriptionController.getPrescriptionsForPatient);  // <-- for patient prescriptions
router.delete('/:id', protect, prescriptionController.deletePrescription);
router.get('/:id', protect, prescriptionController.getPrescriptionById);

module.exports = router;
