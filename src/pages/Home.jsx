import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">
        Welcome to <span>Posture Detector</span>
      </h1>
      <p className="home-description">
        Improve your sitting habits with our intelligent AI-based posture monitoring system.
        Get real-time feedback and personalized recommendations to maintain proper alignment
        throughout your workday.
      </p>
      
      <div className="home-features-container">
        <h2 className="features-title">What We Offer</h2>
        <ul className="home-features">
          <li className="feature-item">
            <div className="feature-icon">🔍</div>
            <div className="feature-text">Real-time posture monitoring with instant alerts</div>
          </li>
          <li className="feature-item">
            <div className="feature-icon">📊</div>
            <div className="feature-text">Detailed analytics and progress tracking</div>
          </li>
          <li className="feature-item">
            <div className="feature-icon">🧠</div>
            <div className="feature-text">Advanced AI detection using MediaPipe and OpenCV</div>
          </li>
          <li className="feature-item">
            <div className="feature-icon">⏱️</div>
            <div className="feature-text">Customizable posture break reminders</div>
          </li>
          <li className="feature-item">
            <div className="feature-icon">🖥️</div>
            <div className="feature-text">Intuitive and accessible user interface</div>
          </li>
          <li className="feature-item">
            <div className="feature-icon">🔒</div>
            <div className="feature-text">Privacy-focused with all processing done locally</div>
          </li>
        </ul>
      </div>
      
      <a href="/live-analysis" className="start-button">
        Start Monitoring
      </a>
    </div>
  );
}

export default Home;