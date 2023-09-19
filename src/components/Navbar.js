// Navbar.js
import React from 'react';
function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/">AI World</a>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <a href="/">Home</a>
        </li>
        <li className="nav-item">
          <a href="/about">About</a>
        </li>
        <li className="nav-item">
          <a href="/contact">Contact</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
