import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { user, logout, isAuthenticated, loading } = useAuth(); // ADD loading here

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActiveLink = (path) => location.pathname === path;
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        {/* Brand */}
        <div className="nav-brand">
          <Link to="/" className="logo-link" onClick={closeMobileMenu}>
            <div className="logo">
              <span className="logo-icon">🎵</span>
              <h2>EmoMusic AI By SVB</h2>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
          <Link
            to="/"
            className={`nav-link ${isActiveLink("/") ? "active" : ""}`}
            onClick={closeMobileMenu}
          >
            <span className="nav-icon">🏠</span>Home
          </Link>

          <Link
            to="/emotion"
            className={`nav-link ${isActiveLink("/emotion") ? "active" : ""}`}
            onClick={closeMobileMenu}
          >
            <span className="nav-icon">📷</span>Detection
          </Link>

          <Link
            to="/playlists"
            className={`nav-link ${isActiveLink("/playlists") ? "active" : ""}`}
            onClick={closeMobileMenu}
          >
            <span className="nav-icon">🎶</span>My Playlists
          </Link>
        </div>

        {/* User Buttons - FIXED: Added loading check */}
        <div className="nav-actions">
          {loading ? (
            <div className="loading-state">
              <span>Loading...</span>
            </div>
          ) : isAuthenticated && user ? (
            <div className="user-actions logged-in">
              <span className="user-name">👤 {user.name || user.username}</span>
              <button className="btn btn-outline" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="user-actions">
              <Link to="/login" className="btn btn-outline" onClick={closeMobileMenu}>
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary" onClick={closeMobileMenu}>
                Sign Up Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`mobile-menu-btn ${isMobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;