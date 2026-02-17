import React, { useEffect, useState } from 'react';
import './PatientProfile.css';
import { FaUserCircle } from 'react-icons/fa';
import api from '../../api/apiConfig';
import { Link } from 'react-router-dom';

const PatientProfile = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile'); // uses /api/auth/profile
        setPatient(res.data);
      } catch (err) {
        console.error('Error fetching patient profile:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!patient) return <p>Failed to load profile.</p>;

  return (
    <div className="patient-profile-container">
      <center><h2>Patient Profile</h2></center>
      <div className="profile-card">
        {patient.profilePic ? (
          <img src={patient.profilePic} alt="Profile" />
        ) : (
          <FaUserCircle className="default-profile-icon" />
        )}
        <div className="profile-info">
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Role:</strong> {patient.role}</p>
          <p><strong>Gender:</strong> {patient.gender || 'N/A'}</p>
          <p><strong>Date of Birth:</strong> {patient.dob || 'N/A'}</p>
          <p><strong>Blood Group:</strong> {patient.bloodGroup || 'N/A'}</p>
          <p><strong>Address:</strong> {patient.address || 'N/A'}</p>
          <p><strong>Medical History:</strong> {patient.medicalHistory || 'N/A'}</p>
          {/* Add more fields here as your schema expands */}
          <Link to='/PatientEdit'><button className="edit-btn">Edit Profile</button></Link>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
