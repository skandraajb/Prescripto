import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorSearch.css";

const DoctorSearch = () => {
  const navigate = useNavigate();

  const doctor = {
    name: "Dr. John Doe",
    specialization: "Cardiologist",
    email: "john.doe@hospital.com",
    phone: "9876543210",
  };

  const [prescriptions, setPrescriptions] = useState([
    { id: 1, date: "2025-04-10", medicines: "Aspirin", notes: "Take after meal" },
    { id: 2, date: "2025-03-22", medicines: "Atorvastatin", notes: "Night only" },
  ]);

  const handleView = (id) => {
    navigate("/PrescriptionDetails", { state: { prescriptionId: id } });
  };

  return (
    <div className="docsearch-container">
      <h2 className="doc-title">Doctor Profile</h2>

      <div className="doc-info">
        <p><strong>Name:</strong> {doctor.name}</p>
        <p><strong>Specialization:</strong> {doctor.specialization}</p>
        <p><strong>Email:</strong> {doctor.email}</p>
        <p><strong>Phone:</strong> {doctor.phone}</p>
      </div>

      <h3 className="pres-title">Prescriptions Given to You</h3>

      {prescriptions.length > 0 ? (
        <table className="pres-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Medicines</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((prescription) => (
              <tr key={prescription.id}>
                <td>{prescription.date}</td>
                <td>{prescription.medicines}</td>
                <td>{prescription.notes}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => handleView(prescription.id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-data">No prescriptions found from this doctor.</p>
      )}
    </div>
  );
};

export default DoctorSearch;
