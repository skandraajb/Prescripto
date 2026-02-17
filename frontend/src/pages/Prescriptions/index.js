import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from '../../api/apiConfig';
import './prescriptions.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const res = await api.get('/prescriptions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPrescriptions(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load prescriptions');
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  // Filter prescriptions based on doctor name, status, or medicine name
  const filteredPrescriptions = prescriptions.filter((p) => {
    const doctorName = p.doctor?.name || p.doctor || '';
    const status = p.status || '';
    const medicineList = p.medicines?.map(m => m.medicine).join(' ') || '';
    const content = `${doctorName} ${status} ${medicineList}`.toLowerCase();
    return content.includes(searchTerm.toLowerCase());
  });

  if (loading) return <p>Loading prescriptions...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <main className="prescriptions-container">
      <h1>📄 Your Prescriptions</h1>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search by doctor, status, or medicine..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-ip"
        />
      </div>

      {filteredPrescriptions.length === 0 ? (
        <p>No prescriptions found.</p>
      ) : (
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {filteredPrescriptions.map((p) => (
            <SwiperSlide key={p._id || p.id}>
              <div className={`prescription-card ${(p.status || '').toLowerCase()}`}>
                <h3>{new Date(p.createdAt || p.date).toLocaleDateString()}</h3>
                <p><strong>Doctor:</strong> {p.doctor?.name || p.doctor || 'Unknown'}</p>
                <p><strong>Summary:</strong> {p.summary || (p.medicines && p.medicines.map(m => m.medicine).join(", ")) || 'N/A'}</p>
                {p.medicines && p.medicines.length > 0 && (
                  <p><strong>Medicines:</strong> {p.medicines.map(m => m.medicine).join(", ")}</p>
                )}
                <span className={`status-label ${(p.status || '').toLowerCase()}`}>{p.status || 'Unknown'}</span>
                <Link to={`/PrescriptionDetails/${p._id || p.id}`}>
                  <button className="view-btn">View Details</button>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </main>
  );
};

export default Prescriptions;
