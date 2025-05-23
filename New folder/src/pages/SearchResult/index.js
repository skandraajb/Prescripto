import React, { useState } from 'react';
import './index.css';
import UserList from '../../components/userlists/UserList';

const SearchResultsPage = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="search-results-container">
      <h2>🔎 Search Users</h2>
      <input
        type="text"
        placeholder="Search by ID or Name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-ip"
      />

      <UserList searchQuery={query.trim()} />
    </div>
  );
};

export default SearchResultsPage;
