import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './patientEdit.css';

const EditPatientProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    address: '',
    bloodGroup: '',
    medicalHistory: '',
  });

  const userId = JSON.parse(localStorage.getItem('user'))?._id;

  useEffect(() => {
    axios.get(`http://localhost:5000/api/patients/${userId}`)
      .then(res => {
        setFormData(res.data);
      })
      .catch(err => console.error('Failed to load profile:', err));
  }, [userId]);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/patients/${userId}`, formData);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Patient Profile</h2>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={formData.name} onChange={handleChange} required />

        <label>Email</label>
        <input name="email" value={formData.email } disabled />

        <label>Phone</label>
        <input name="phone" value={formData.phone} onChange={handleChange} />

        <label>Gender</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <label>Date of Birth</label>
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} />

        <label>Address</label>
        <input name="address" value={formData.address} onChange={handleChange} />

        <label>Blood Group</label>
        <input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} />

        <label>Medical History</label>
        <textarea name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditPatientProfile;
