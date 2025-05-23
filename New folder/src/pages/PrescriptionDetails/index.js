import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/apiConfig';  // Adjust path if needed
import './prescriptiondetails.css';

const PrescriptionDetails = () => {
  const { id } = useParams();
  const [prescription, setPrescription] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrescription = async () => {
    try {
      const res = await api.get(`/prescriptions/${id}`);
      setPrescription(res.data);
    } catch (err) {
      console.error('Failed to fetch prescription:', err);
      setError('Failed to load prescription');
    }
  };

  fetchPrescription();
}, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!prescription) return <p>Loading...</p>;

  return (
    <main className="prescription-details">
      <h1>📝 Prescription Details</h1>

      <div className="details-card">
        <p><strong>Doctor:</strong> {prescription.doctor?.name || 'Unknown'}</p>
        <p><strong>Date:</strong> {new Date(prescription.createdAt).toLocaleDateString()}</p>

        <h2>💊 Medicines</h2>
        <table className="prescription-table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Dosage per day</th>
              <th>Dosage Time</th>
              <th>Duration (Days)</th>
            </tr>
          </thead>
          <tbody>
            {prescription.medicines.map((med, index) => (
              <tr key={index}>
                <td>{med.medicine}</td>
                <td>{med.dosage}</td>
                <td>{med.mealTiming}</td>
                <td>{med.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {prescription.dosageInstructions && (
          <>
            <h2>💡 Dosage Instructions</h2>
            <p>{prescription.dosageInstructions}</p>
          </>
        )}

        {prescription.contactInfo && (
          <>
            <h2>📞 Contact Information</h2>
            <p>{prescription.contactInfo}</p>
          </>
        )}

        {prescription.additionalNotes && (
          <>
            <h2>📝 Additional Notes</h2>
            <p>{prescription.additionalNotes}</p>
          </>
        )}
      </div>

    </main>
  );
};

export default PrescriptionDetails;
