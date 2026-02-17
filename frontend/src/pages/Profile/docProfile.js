import React, { useEffect, useState } from 'react';
import './docProfile.css';
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DoctorProfile = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setError("No user found in localStorage.");
          setLoading(false);
          return;
        }

        const { _id } = JSON.parse(storedUser);
        const res = await fetch(`http://localhost:5000/api/doctors/${_id}`);

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to fetch doctor profile.");
        }

        const data = await res.json();
        console.log("Doctor Data:", data);
        setDoctorData(data);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, []);

  if (loading) return <div className="doctor-profile-container"><p>Loading...</p></div>;
  if (error) return <div className="doctor-profile-container"><p>{error}</p></div>;
  if (!doctorData) return <div className="doctor-profile-container"><p>Doctor profile not found.</p></div>;

  return (
    <div className="doctor-profile-container">
      <h2>Doctor Profile</h2>
      <div className="profile-card">
        <div className="icon-container">
          <FaUserCircle size={100} />
        </div>
        <p><strong>Name:</strong> Dr. {doctorData.name}</p>
        <p><strong>Email:</strong> {doctorData.email}</p>
        <p><strong>ID:</strong> {doctorData._id}</p>
        <p><strong>Specialization:</strong> {doctorData.specialization || 'Not provided'}</p>
        <p><strong>Experience:</strong> {doctorData.experience || 'Not provided'}</p>
        <p><strong>Phone:</strong> {doctorData.phone || 'Not provided'}</p>
        <p><strong>Location:</strong> {doctorData.location || 'Not provided'}</p>
        <Link to='/docEdit'><button className="edit-btn">Edit Profile</button></Link>
      </div>
    </div>
  );
};

export default DoctorProfile;
