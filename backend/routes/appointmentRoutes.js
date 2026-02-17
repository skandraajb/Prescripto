const express = require('express');
const router = express.Router();

const appointmentController = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');  // destructure protect middleware

// Protect all routes with the 'protect' middleware
router.post('/', protect, appointmentController.createAppointment);
router.get('/', protect, appointmentController.getAppointmentsForPatient);
router.get('/doctor', protect, appointmentController.getAppointmentsForDoctor);  // NEW
router.delete('/:id', protect, appointmentController.deleteAppointment);

module.exports = router;
