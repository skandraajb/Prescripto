const Appointment = require('../models/Appointment');

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;
    const patientId = req.user._id; // Set by auth middleware

    const newAppointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      date,
      time,
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create appointment', error });
  }
};

// Get all appointments for the logged-in patient
exports.getAppointmentsForPatient = async (req, res) => {
  try {
    const patientId = req.user._id;
    const appointments = await Appointment.find({ patient: patientId })
      .populate('doctor', 'name specialty');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error });
  }
};

// Get all appointments for the logged-in doctor
// Get all appointments for the logged-in doctor
exports.getAppointmentsForDoctor = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate('patient', 'name customId')  // populate patient's name and custom ID
      .exec();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch doctor appointments', error });
  }
};


// Delete an appointment (patient or doctor can delete)
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Allow deletion if user is the patient OR the doctor of the appointment
    const userId = req.user._id.toString();
    if (
      appointment.patient.toString() !== userId &&
      appointment.doctor.toString() !== userId
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this appointment' });
    }

    await appointment.deleteOne();
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete appointment', error });
  }
};
