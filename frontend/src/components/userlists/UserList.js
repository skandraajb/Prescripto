import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/apiConfig'; // Adjust the import path based on your folder structure
import './userlist.css';

const UserList = ({ searchQuery = '' }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users/names');
        setUsers(res.data);
      } catch (err) {
        setError('Failed to fetch user names');
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(q)) ||
      (user.customId && user.customId.toLowerCase().includes(q))
    );
  });

  return (
    <div className="user-list-container">
      <h2>👤 User Names</h2>
      {error && <p className="user-list-error">{error}</p>}
      {filteredUsers.length === 0 ? (
        <p>No users found matching "{searchQuery}"</p>
      ) : (
        <ul className="user-list-ul">
          {filteredUsers.map((user) => (
            <li key={user._id} className="user-list-li">
              <span className="user-list-name">{user.name}</span>
              <Link
                to={
                  user.role === 'doctor'
                    ? `/patientprofile/${user._id}`
                    : `/doctorprofile/${user._id}`
                }
              >
                <button className="user-list-button">View Profile</button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
