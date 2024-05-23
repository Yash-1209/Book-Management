// src/Navbar.js
import React from 'react';
import logo from './logo.png';
import userLogo from './Logo3.png'

const Navbar = () => {
  return (
<>  
  <nav className="navbar">
      <div className="navbar-container">
        <img src={logo} alt="Company Logo" className="navbar-logo" />
        <span className="navbar-title">Nuo</span>
      </div>
      <div className="navbar-right">
          <img src={userLogo} alt="User Logo" className="user-logo" />
        </div>
      
    </nav>
    </>
  );
};

export default Navbar;
