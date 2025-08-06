import React from 'react';
import './Navbar.css';

export default function Navbar({ filterText, onFilterChange }) {
  return (
    <nav className="navbar">
      <img src="/logo.jpeg" alt="Logo" className="logo" />
      <div className="nav-icon">🏠</div>
      <div className="nav-icon">💬</div>
      <input
        type="text"
        className="search-box"
        placeholder="Search comments..."
        value={filterText}
        onChange={e => onFilterChange(e.target.value)}
      />
      <div className="nav-icon">⚙️</div>
    </nav>
  );
}
