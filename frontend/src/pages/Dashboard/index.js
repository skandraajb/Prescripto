import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFileMedical,
  FaCalendarCheck,
  FaUserEdit,
  FaPills,
  FaHistory,
  FaNotesMedical
} from "react-icons/fa";
import api from "../../api/apiConfig"; // Adjust path as needed
import './index.css';

const PatientDashboard = () => {
  const [patientName, setPatientName] = useState('');

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await api.get("/patients/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPatientName(res.data.name); // Assumes backend returns `{ name: "John Doe" }`
      } catch (error) {
        console.error("Failed to fetch patient data:", error);
      }
    };

    fetchPatientData();
  }, []);

  return (
    <main className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {patientName || 'Patient'} 👋</h1>
        <p>Manage your prescriptions and appointments easily.</p>
      </header>

      <div className="dashboard-content">
        <section className="dashboard-left">
          <div className="cards-grid">
            <div className="card">
              <FaFileMedical className="card-icon" />
              <h3>Prescriptions</h3>
              <p>View and download your prescriptions.</p>
              <Link to="/prescriptions" className="view-btn">View</Link>
            </div>
            <div className="card">
              <FaCalendarCheck className="card-icon" />
              <h3>Appointments</h3>
              <p>Check upcoming doctor appointments.</p>
              <Link to="/Appointment" className="view-btn">View</Link>
            </div>
            <div className="card">
              <FaUserEdit className="card-icon" />
              <h3>Profile</h3>
              <p>View your personal details.</p>
              <Link to="/PatientProfile" className="view-btn">View</Link>
            </div>
            <div className="card">
              <FaPills className="card-icon" />
              <h3>Medications</h3>
              <p>Track your ongoing medication schedules.</p>
              <Link to="/patient/medications" className="view-btn">Track</Link>
            </div>
            <div className="card">
              <FaHistory className="card-icon" />
              <h3>Medical History</h3>
              <p>View past prescriptions & diagnoses.</p>
              <Link to="/prescriptions" className="view-btn">View</Link>
            </div>
            <div className="card">
              <FaNotesMedical className="card-icon" />
              <h3>Doctor Notes</h3>
              <p>Read notes and suggestions from your doctor.</p>
              <Link to="/patient/doctor-notes" className="view-btn">Read</Link>
            </div>
          </div>
        </section>

        <section className="dashboard-right">
          <h2>📌 Recent Activity</h2>
          <ul className="recent-activity-list">
            <li>✅ Prescription added: Paracetamol - 20 Feb 2025</li>
            <li>📅 Appointment scheduled with Dr. Smith - 25 Feb 2025</li>
            <li>⚙️ Profile updated - 15 Feb 2025</li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default PatientDashboard;
