import React, { useState, useEffect } from 'react';
import api from '../../api/apiConfig';
import './Appointment.css';
import { MdCancel } from 'react-icons/md';

const Appointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [availability, setAvailability] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        const doctorsWithAvailability = response.data.map(doc => ({
          ...doc,
          available: doc.availableTimes || ['9:00 AM', '10:30 AM', '2:00 PM'],
          fee: doc.fee || '$100',
        }));
        setDoctors(doctorsWithAvailability);
        setFilteredDoctors(doctorsWithAvailability);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const res = await api.get('/appointments');
        console.log('Appointments from backend:', res.data);
        setAppointments(res.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchDoctors();
    fetchAppointments();
  }, []);

  useEffect(() => {
    const filtered = doctors.filter((doctor) => {
      const nameMatch = doctor.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const specMatch = specialization ? doctor.specialization?.toLowerCase().includes(specialization.toLowerCase()) : true;
      const availMatch = availability
        ? doctor.available?.some(time => (availability === 'AM' ? time.includes('AM') : time.includes('PM')))
        : true;
      return nameMatch && specMatch && availMatch;
    });
    setFilteredDoctors(filtered);
  }, [searchQuery, specialization, availability, doctors]);

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedTime('');
    setSelectedDate('');
    setIsModalOpen(true);
  };

  const handleConfirmAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }
    try {
      const appointmentPayload = {
        doctorId: selectedDoctor._id,
        date: selectedDate,
        time: selectedTime,
      };

      const res = await api.post('/appointments', appointmentPayload);
      alert(`Appointment booked with Dr. ${selectedDoctor.name} on ${selectedDate} at ${selectedTime}`);

      setAppointments(prev => [...prev, res.data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  const handleCancelAppointment = async (appointmentId, index) => {
    try {
      await api.delete(`/appointments/${appointmentId}`);
      const updated = [...appointments];
      updated.splice(index, 1);
      setAppointments(updated);
      alert('Appointment cancelled successfully.');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment.');
    }
  };

  return (
    <div className="appointment-container">
      <h1 className="appheading">Book an Appointment</h1>

      <div className="search-filter">
        <input
          type="text"
          placeholder="Search doctors by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
          <option value="">All Specializations</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Pediatrics">Pediatrics</option>
        </select>

        <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
          <option value="">Any Time</option>
          <option value="AM">Morning (AM)</option>
          <option value="PM">Afternoon (PM)</option>
        </select>
      </div>

      <div className="doctor-list">
        {filteredDoctors.length === 0 ? (
          <p>No doctors found.</p>
        ) : (
          filteredDoctors.map((doctor) => (
            <div key={doctor._id} className="doctor-card">
              <h3>{doctor.name}</h3>
              <p>Specialty: {doctor.specialization || 'N/A'}</p>
              <p>Location: {doctor.location || 'N/A'}</p>
              <p>Visiting Fee: {doctor.fee}</p>
              <button className="appointment-button" onClick={() => handleBookAppointment(doctor)}>
                Book Appointment
              </button>
            </div>
          ))
        )}
      </div>

      {isModalOpen && selectedDoctor && (
        <div className="modal">
          <h2>Book Appointment with Dr. {selectedDoctor.name}</h2>
          <p>Specialty: {selectedDoctor.specialization || 'N/A'}</p>
          <p>Location: {selectedDoctor.location || 'N/A'}</p>
          <p>Visiting Fee: {selectedDoctor.fee}</p>

          <h3>Select Appointment Date:</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-picker"
          />

          <h3>Select Available Time Slot:</h3>
          <div className="time-slots">
            {selectedDoctor.available.map((time) => (
              <button
                key={time}
                className={`appointment-button ${selectedTime === time ? 'selected' : ''}`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>

          {selectedTime && <p>Selected Time: {selectedTime}</p>}

          <div>
            <button className="appointment-button cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button className="appointment-button" onClick={handleConfirmAppointment}>
              Confirm Appointment
            </button>
          </div>
        </div>
      )}

      <div className="final-appointments">
        <h2>Your Appointments</h2>
        {appointments.length === 0 ? (
          <p>No appointments booked yet.</p>
        ) : (
          <ul>
            {appointments.map((appointment, index) => (
              <li key={appointment._id}>
                <button
                  className="appointment-button-cancel"
                  onClick={() => handleCancelAppointment(appointment._id, index)}
                  style={{ marginLeft: '10px', backgroundColor: '#e74c3c' }}
                >
                  <MdCancel />
                </button>
                <strong>Doctor:</strong> {appointment.doctor?.name || appointment.doctor} |{' '}
                <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()} |{' '}
                <strong>Time:</strong> {appointment.time}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Appointment;
