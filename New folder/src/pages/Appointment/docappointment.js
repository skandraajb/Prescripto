import React, { useState, useEffect } from 'react';
import api from '../../api/apiConfig';  // axios instance with auth token
import './docappointment.css';

const DoctorAppointments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctor's appointments on mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/appointments/doctor');
        setAppointments(res.data);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
        alert('Error loading appointments');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // Handle marking appointment as completed (delete from backend)
  const handleComplete = async (id) => {
    if (!window.confirm('Mark this appointment as completed? This will remove it from your list.')) return;
    try {
      await api.delete(`/appointments/${id}`);
      setAppointments(prev => prev.filter(appt => appt._id !== id));
    } catch (error) {
      console.error('Failed to complete appointment:', error);
      alert('Failed to mark appointment as completed. Try again.');
    }
  };

  // Filter appointments by patient customId or name (case-insensitive), safely checking for undefined
  const filteredAppointments = appointments.filter(appt =>
  (appt.patient?.customId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appt.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div className="doctor-appointments-container">
      <h2>📅 Appointments</h2>

      <center>
        <input
          type="text"
          placeholder="Search by Patient ID or Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-appointment"
        />
      </center>

      {filteredAppointments.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>No appointments found.</p>
      ) : (
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appt) => (
              <tr key={appt._id}>
                <td>{appt.patient?.customId || 'N/A'}</td>
                <td>{appt.patient?.name || 'N/A'}</td>
                <td>{new Date(appt.date).toLocaleDateString()}</td>
                <td>{appt.time}</td>
                <td>
                  <button onClick={() => handleComplete(appt._id)} className="mark-complete">
                    Mark Completed
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DoctorAppointments;
