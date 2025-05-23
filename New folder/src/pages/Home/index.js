import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './home.css';


const HomePage = () => {
  const navigate = useNavigate();

  

  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Your Digital Prescription Hub</h1>
            <p>Manage prescriptions securely and connect with doctors online.</p>
            <div className="buttons">
              <button className="cta-btn" onClick={() => navigate("/signin")}>
                Get Started
              </button>
              <button className="cta-secondary">Find a Doctor</button>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <h3>📄 Easy Prescription Management</h3>
          <p>View, store, and share prescriptions effortlessly.</p>
        </div>
        <div className="feature">
          <h3>🩺 Doctor-Patient Connectivity</h3>
          <p>Book appointments and consult with experts anytime.</p>
        </div>
        <div className="feature">
          <h3 style={{ paddingBottom: "30px" }}>🔐 Secure & Reliable</h3>
          <p>Your medical records are safe with end-to-end encryption.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
