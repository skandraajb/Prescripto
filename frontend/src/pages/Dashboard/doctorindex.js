import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import './doctorindex.css';


const DoctorDashboard = () => {


  return (
    <main className="doctor-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Welcome, Doctor 👨‍⚕️</h1>
        <p>Manage your appointments and prescriptions efficiently.</p>
      </header>

      {/* Main Content */}
      <section className="dashboard-content">
        {/* Left Side: Stats */}
        <div className="stats-section">
          <div className="card">
            <h3>👥 Total Patients</h3>
            <p>120</p>
          </div>
          <div className="card">
            <h3>📅 Pending Appointments</h3>
            <p>5</p>
          </div>
          <div className="card">
            <h3>📄 Recent Prescriptions</h3>
            <p>35</p>
          </div>
        </div>

        {/* Right Side: Appointments & Prescriptions */}
        <div className="details-section">
          {/* Upcoming Appointments */}
          <div className="appointments">
            <h2>📅 Upcoming Appointments</h2>
            <ul>
              <li>John Doe - 27 Feb 2025 at 10:00 AM</li>
              <li>Jane Smith - 28 Feb 2025 at 2:00 PM</li>
            </ul>
            <Link to="/docappointment" className="view-btn">View All</Link>
          </div>

          {/* Recent Prescriptions */}
          <div className="recent-prescriptions">
            <h2>📄 Recent Prescriptions</h2>
            <ul>
              <li>John Doe - Paracetamol, Cough Syrup</li>
              <li>Jane Smith - Insulin, Metformin</li>
            </ul>
            <Link to="/docprescriptions" className="view-btn">View All</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DoctorDashboard;
