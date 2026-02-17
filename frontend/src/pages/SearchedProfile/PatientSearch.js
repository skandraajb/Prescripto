import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/apiConfig'; // Make sure this points correctly to your axios config
import { FaUserCircle } from 'react-icons/fa';
import './PatientSearch.css';

const SearchedPatientProfile = () => {
  const { patientId } = useParams(); // get patientId from URL params
  const [patient, setPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterByMe, setFilterByMe] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) {
        setError('No patient ID provided.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        console.log('Fetching patient data for:', patientId);

        // Fetch patient info
        const patientRes = await api.get(`/patients/${patientId}`);
        console.log('Patient data:', patientRes.data);
        setPatient(patientRes.data);

        // Fetch prescriptions
        const prescriptionsRes = await api.get(`/prescriptions/patient/${patientId}`);
        console.log('Prescriptions data:', prescriptionsRes.data);
        setPrescriptions(prescriptionsRes.data);

        setError('');
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError('Failed to fetch patient data.');
      } finally {
        setLoading(false);
        console.log('Loading finished');
      }
    };

    fetchPatientData();
  }, [patientId]);

  if (loading) return <p>Loading patient profile...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!patient) return <p>No patient data found.</p>;

  const filtered = filterByMe
    ? prescriptions.filter(p => p.mine)
    : prescriptions;

  return (
    <div className="searched-patient-profile">
      <div className="profile-header">
        <FaUserCircle className="profile-icon" />
        <h2>{patient.name}</h2>
        <p>ID: {patient.customId || patient._id} | Age: {patient.age || '-'} | Gender: {patient.gender || '-'}</p>
      </div>

      <div className="filter-section">
        <label>
          <input
            type="checkbox"
            checked={filterByMe}
            onChange={() => setFilterByMe(!filterByMe)}
          />
          Show only my prescriptions
        </label>
      </div>

      <div className="prescription-list">
        {filtered.length === 0 ? (
          <p>No prescriptions found{filterByMe ? ' matching filter' : ''}.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Summary</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id || p.id}>
                  <td>{p.customId || p.id || '-'}</td>
                  <td>{p.date ? new Date(p.date).toLocaleDateString() : '-'}</td>
                  <td>{p.doctorName || p.doctor || '-'}</td>
                  <td>{p.summary || '-'}</td>
                  <td>
                    <Link to={`/prescriptiondetails/${p._id || p.id}`}>
                      <button className="view-btn">View ➔</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SearchedPatientProfile;
