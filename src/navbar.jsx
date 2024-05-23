// src/Navbar.js
import React from 'react';
import logo from './logo.png'; // Ensure you have a logo image in the src directory

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <img src={logo} alt="Company Logo" className="navbar-logo" />
        <span className="navbar-title">Nuo</span>
      </div>
    </nav>
  );
};

export default Navbar;
