import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import LiveAnalysis from './pages/LiveAnalysis';
import Home from './pages/Home';
import './App.css';

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your posture application...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        {/* Sidebar Navigation */}
        <nav className="sidebar">
          <div className="logo-container">
            <h1 className="app-logo">PostureTrack</h1>
          </div>
          
          <div className="nav-links">
            <Link to="/" className="nav-link">
              <i className="nav-icon home-icon"></i>
              <span>Home</span>
            </Link>
            
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="nav-link">
                  <i className="nav-icon dashboard-icon"></i>
                  <span>Dashboard</span>
                </Link>
                
                <Link to="/reports" className="nav-link">
                  <i className="nav-icon reports-icon"></i>
                  <span>Reports</span>
                </Link>
                
                <Link to="/live-analysis" className="nav-link">
                  <i className="nav-icon live-icon"></i>
                  <span>Live Analysis</span>
                </Link>
              </>
            )}
          </div>
          
          <div className="user-section">
            {isAuthenticated ? (
              <>
                <div className="user-info">
                  <div className="user-avatar">
                    {user?.picture ? (
                      <img src={user.picture} alt={user.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {user?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <div className="user-details">
                    <p className="user-name">{user?.name}</p>
                    <p className="user-email">{user?.email}</p>
                  </div>
                </div>
                <button 
                  className="auth-button logout-button"
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                >
                  Log Out
                </button>
              </>
            ) : (
              <button 
                className="auth-button login-button"
                onClick={() => loginWithRedirect()}
              >
                Log In
              </button>
            )}
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="main-content">
          <div className="content-container">
            <Routes>
              <Route path="/" element={<Home />} />
              {isAuthenticated ? (
                <>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/live-analysis" element={<LiveAnalysis />} />
                </>
              ) : (
                <>
                  <Route path="/dashboard" element={<Navigate to="/" replace />} />
                  <Route path="/reports" element={<Navigate to="/" replace />} />
                  <Route path="/live-analysis" element={<Navigate to="/" replace />} />
                </>
              )}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;