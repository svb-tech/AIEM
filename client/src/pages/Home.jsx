// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../pages/Navbar"; 
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* Use the separate Navbar component */}
      <Navbar />

      {/* Features Section - Now at the top */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <div className="hero-badge">
              <span>AI-Powered Emotion Detection</span>
            </div>
            <h1 className="section-title">
              Discover Music Through Your
              <span className="highlight-gradient"> Emotions</span>
            </h1>
            <p className="section-subtitle">
              Advanced AI analyzes your facial expressions in real-time and
              creates personalized music playlists that perfectly match your
              emotional state. Experience music like never before.
            </p>
          </div>
          <div className="features-grid two-cards">
            <div className="feature-card">
              <div className="feature-number">01</div>
              <div className="feature-icon">📷</div>
              <h3>Emotion Detection</h3>
              <p>
                Allow camera access for real-time facial expression analysis
                using advanced AI algorithms to detect your current mood and emotions
              </p>
              <ul className="feature-list">
                <li>Real-time processing</li>
                <li>Multiple emotion detection</li>
                <li>High accuracy AI models</li>
                <li>Instant mood analysis</li>
              </ul>
              <Link to="/emotion" className="btn btn-primary" style={{marginTop: '1rem'}}>
                Start Detection
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-number">02</div>
              <div className="feature-icon">💾</div>
              <h3>Custom Playlists</h3>
              <p>
                Create, manage, and customize your personal music playlists
                based on your emotional preferences and listening history
              </p>
              <ul className="feature-list">
                <li>Custom playlist creation</li>
                <li>Favorite tracks saving</li>
                <li>Playlist sharing</li>
                <li>Emotion-based organization</li>
              </ul>
              <Link to="/playlists" className="btn btn-outline" style={{marginTop: '1rem'}}>
                View Playlists
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Emotions Detected</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Songs Matched</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99%</div>
              <div className="stat-label">Accuracy Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Available</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          {/* Brand + Company Info */}
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-icon">🎵</span>
              <h3>EmoMusic AI</h3>
            </div>

            <p>
              Transforming emotions into personalized music experiences through
              advanced AI technology.
            </p>

            {/* Company Credit */}
            <div className="company-credit">
              <span className="credit-text">Developed & Managed by</span>

              <div className="company-badge">
                <span className="company-name">SVB</span>
                <span className="company-tag">Tech Solutions</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="footer-bottom">
            <p>
              &copy; 2025 EmoMusic AI — An <strong>SVB Tech Solutions</strong>{" "}
              Innovation. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;