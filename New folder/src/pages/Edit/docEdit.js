import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './docEdit.css';

const EditDoctorProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    location: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const userId = JSON.parse(localStorage.getItem('user'))._id;

  useEffect(() => {
    axios.get(`http://localhost:5000/api/doctors/${userId}`)
      .then(response => {
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          specialization: response.data.specialization || '',
          experience: response.data.experience || '',
          location: response.data.location || '',
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch profile data');
        setLoading(false);
      });
  }, [userId]);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      await axios.put(`http://localhost:5000/api/doctors/${userId}`, formData);
      setSuccessMsg('Profile updated successfully!');
    } catch {
      setError('Failed to update profile');
    }
  };

  if (loading) return <p>Loading profile data...</p>;

  return (
    <div className="edit-profile-container">
      <h2>Edit Doctor Profile</h2>
      

      <form onSubmit={handleSubmit} className="edit-profile-form">
        <label>Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input-field"
          required
        />

        <label>Email</label>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
          disabled
        />

        <label>Phone</label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="input-field"
        />

        <label>Specialization</label>
        <input
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          className="input-field"
        />

        <label>Experience</label>
        <input
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="input-field"
        />

        <label>Location</label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="input-field"
        />
        {error && <p className="error-msg">{error}</p>}
        {successMsg && <p className="success-msg">{successMsg}</p>}
        <button type="submit" className="submit-btn">Save Changes</button>
      </form>
    </div>
  );
};

export default EditDoctorProfile;
