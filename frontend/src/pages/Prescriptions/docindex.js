import React, { useState, useEffect } from 'react';
import api from '../../api/apiConfig';  // axios instance with auth token
import './docprescription.css';
import { MdDelete, MdArrowForward, MdAdd } from 'react-icons/md';
import { Link } from "react-router-dom";

const DoctorPrescriptionPage = () => {
  const [searchId, setSearchId] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');   // <-- Added error state

  // Form state
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [medicineRows, setMedicineRows] = useState([
    { medicine: '', dosage: 0, mealTiming: 'before meal', duration: '' }
  ]);
  const [dosageInstructions, setDosageInstructions] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Fetch prescriptions on mount
  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    setError('');  // reset error before fetch
    try {
      const res = await api.get('/prescriptions/doctor');
      setPrescriptions(res.data);
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
      if (error.response) {
        setError(`Error: ${error.response.status} ${error.response.data.message || error.response.statusText}`);
      } else {
        setError('Network or server error');
      }
      setPrescriptions([]);  // clear old data on error
    } finally {
      setLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter((p) =>
    p.patient?.customId?.toLowerCase().includes(searchId.toLowerCase())
  );

  // Medicine rows handlers
  const handleMedicineChange = (index, field, value) => {
    const updatedRows = [...medicineRows];
    updatedRows[index][field] = value;
    setMedicineRows(updatedRows);
  };

  const addMedicineRow = () => {
    setMedicineRows([
      ...medicineRows,
      { medicine: '', dosage: 0, mealTiming: 'before meal', duration: '' }
    ]);
  };

  const removeMedicineRow = (index) => {
    const updatedRows = medicineRows.filter((_, i) => i !== index);
    setMedicineRows(updatedRows);
  };

  // Fetch patient by customId before submitting prescription
  const fetchPatientByCustomId = async (customId) => {
    try {
      const res = await api.get(`/patients/search/${customId}`);
      return res.data; // full patient object including _id
    } catch (error) {
      return null;
    }
  };

  // Submit prescription to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientId || !patientName) {
      alert('Please enter patient name and custom ID');
      return;
    }

    // Lookup patient _id from customId
    const patient = await fetchPatientByCustomId(patientId);
    if (!patient) {
      alert('Invalid patient custom ID. Please check and try again.');
      return;
    }

    if (medicineRows.some(row => !row.medicine || row.dosage <= 0 || !row.duration)) {
      alert('Please fill all medicine fields properly');
      return;
    }

    const payload = {
      patientId: patient._id,  // Use real MongoDB _id here
      medicines: medicineRows,
      dosageInstructions,
      contactInfo,
      additionalNotes,
    };

    try {
      await api.post('/prescriptions', payload);
      alert('Prescription submitted successfully!');
      // Clear form
      setPatientName('');
      setPatientId('');
      setMedicineRows([{ medicine: '', dosage: 0, mealTiming: 'before meal', duration: '' }]);
      setDosageInstructions('');
      setContactInfo('');
      setAdditionalNotes('');
      // Refresh prescription list
      fetchPrescriptions();
    } catch (error) {
      console.error('Failed to submit prescription:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Failed to submit prescription');
      }
    }
  };

  return (
    <div className="doctor-prescription-container">
      <div className="view-section">
        <h2>📄 Past Prescriptions</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Patient ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className='searchid'
          />
        </div>
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading prescriptions...</p>
        ) : error ? (
          <p className="error-message" style={{ color: 'red', textAlign: 'center' }}>{error}</p>
        ) : (
          <table className="prescription-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Summary</th>
                <th>View prescription</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrescriptions.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    No prescriptions found.
                  </td>
                </tr>
              ) : (
                filteredPrescriptions.map((p) => (
                  <tr key={p._id}>
                    <td>{p.patient?.customId || 'N/A'}</td>
                    <td>{p.patient?.name || 'N/A'}</td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td>
                      {p.medicines.map(m => `${m.medicine} (${m.dosage} per day)`).join(', ')}
                    </td>
                    <td>
                      <center>
                        <Link to={`/prescriptiondetails/${p._id}`}>
                          <button className='arrow'><MdArrowForward /></button>
                        </Link>
                      </center>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="add-section">
        <h2>➕ Add New Prescription</h2>
        <form className="prescription-form" onSubmit={handleSubmit}>
          <h3>Name</h3>
          <input
            type="text"
            placeholder="Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
          />
          <h3>ID</h3>
          <input
            type="text"
            placeholder="Patient Custom ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            required
          />
          <h3>💊 Medicine</h3>
          <table className="medicine-table">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Dosage per day</th>
                <th>Dosage Time</th>
                <th>Duration (Days)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicineRows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      placeholder="Medicine Name"
                      value={row.medicine}
                      onChange={(e) => handleMedicineChange(index, 'medicine', e.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <div className="dosage-controls">
                      <button
                        type="button"
                        onClick={() => handleMedicineChange(index, 'dosage', Math.max(0, row.dosage - 1))}
                        className='minus'
                      >-</button>
                      <input
                        type="number"
                        value={row.dosage}
                        onChange={(e) => handleMedicineChange(index, 'dosage', Math.max(0, Number(e.target.value)))}
                        min="0"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleMedicineChange(index, 'dosage', row.dosage + 1)}
                        className='plus'
                      >+</button>
                    </div>
                  </td>
                  <td>
                    <select
                      value={row.mealTiming}
                      onChange={(e) => handleMedicineChange(index, 'mealTiming', e.target.value)}
                      required
                    >
                      <option value="before meal">Before Meal</option>
                      <option value="after meal">After Meal</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Duration (e.g. 7 days)"
                      value={row.duration}
                      onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <div className="medicine-buttons">
                      <button type="button" onClick={() => removeMedicineRow(index)} className="remove">
                        <MdDelete size={20} />
                      </button>
                      <button type="button" onClick={addMedicineRow} className="add">
                        <MdAdd size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <textarea
            placeholder="💡 Dosage Instructions"
            value={dosageInstructions}
            onChange={(e) => setDosageInstructions(e.target.value)}
            rows={3}
          />
          <textarea
            placeholder="📞 Contact Info"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            rows={2}
          />
          <textarea
            placeholder="📝 Additional Notes"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            rows={2}
          />
          <button type="submit" className="submit-btn">Submit Prescription</button>
        </form>
      </div>
    </div>
  );
};

export default DoctorPrescriptionPage;
