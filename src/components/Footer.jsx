import React from 'react';

export const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Boat Electronics Store. All rights reserved.</p>
      <div className="footer-links">
        <a href="#" className="nav-link">Privacy Policy</a>
        <a href="#" className="nav-link">Terms of Service</a>
        <a href="#" className="nav-link">Contact Us</a>
      </div>
    </footer>
  );
};
