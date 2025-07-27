import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import PostureTrendChart from '../components/PostureTrendChart';
import './Reports.css';

function Reports() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'week', 'month'
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        const token = await getAccessTokenSilently({ audience: 'https://posturedetectionapi' });
        const response = await axios.get('http://localhost:5000/api/sessions/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        setError('Failed to load session data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [getAccessTokenSilently]);

  const filteredSessions = () => {
    if (filter === 'all') return sessions;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    if (filter === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (filter === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    }
    
    return sessions.filter(session => new Date(session.date) >= cutoffDate);
  };

  const getDateString = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeString = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getSessionDuration = (session) => {
    if (!session.endTime) return 'In progress';
    
    const start = new Date(session.date);
    const end = new Date(session.endTime);
    const diffMs = Math.abs(end - start);
    const minutes = Math.floor(diffMs / 60000);
    
    if (minutes < 1) return 'Less than a minute';
    if (minutes === 1) return '1 minute';
    return `${minutes} minutes`;
  };

  const getPostureStatusSummary = (session) => {
    if (!session.feedback || session.feedback.length === 0) {
      return { upright: 0, issues: 0, total: 0, percentage: 0 };
    }
    
    let upright = 0;
    let total = session.feedback.length;
    
    session.feedback.forEach(fb => {
      const status = fb?.status || "";
      if (status.includes("Upright")) upright++;
    });
    
    return {
      upright,
      issues: total - upright,
      total,
      percentage: Math.round((upright / total) * 100)
    };
  };

  const getStatusClass = (percentage) => {
    if (percentage >= 80) return 'status-excellent';
    if (percentage >= 60) return 'status-good';
    if (percentage >= 40) return 'status-fair';
    return 'status-poor';
  };

  if (isLoading) {
    return <div className="reports-loading">Loading your session reports...</div>;
  }

  if (error) {
    return <div className="reports-error">{error}</div>;
  }

  if (sessions.length === 0) {
    return (
      <div className="reports-container">
        <div className="reports-header">
          <h1>Session Reports</h1>
          <p className="no-data-message">No sessions recorded yet. Start a posture tracking session to see your reports here.</p>
        </div>
      </div>
    );
  }

  const displaySessions = filteredSessions();

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Session Reports</h1>
        <div className="filter-controls">
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Time
          </button>
          <button 
            className={`filter-button ${filter === 'month' ? 'active' : ''}`}
            onClick={() => setFilter('month')}
          >
            Last Month
          </button>
          <button 
            className={`filter-button ${filter === 'week' ? 'active' : ''}`}
            onClick={() => setFilter('week')}
          >
            Last Week
          </button>
        </div>
      </div>

      <div className="reports-content">
        <div className="reports-chart-container">
          <h2>Posture Trends Visualization</h2>
          <div className="chart-wrapper">
            <PostureTrendChart sessions={displaySessions} />
          </div>
        </div>

        <div className="sessions-list-container">
          <h2>Sessions History</h2>
          <div className="sessions-list">
            {displaySessions.length === 0 ? (
              <p className="no-sessions-message">No sessions found for the selected time period.</p>
            ) : (
              displaySessions.map((session, index) => {
                const postureSummary = getPostureStatusSummary(session);
                const statusClass = getStatusClass(postureSummary.percentage);
                
                return (
                  <div 
                    key={session._id || index}
                    className={`session-card ${selectedSession === index ? 'selected' : ''}`}
                    onClick={() => setSelectedSession(selectedSession === index ? null : index)}
                  >
                    <div className="session-header">
                      <div className="session-date">
                        <div className="date">{getDateString(session.date)}</div>
                        <div className="time">{getTimeString(session.date)}</div>
                      </div>
                      <div className={`session-status ${statusClass}`}>
                        <div className="status-percentage">{postureSummary.percentage}%</div>
                        <div className="status-label">Good Posture</div>
                      </div>
                    </div>
                    
                    <div className="session-details">
                      <div className="detail-item">
                        <span className="detail-label">Interval:</span>
                        <span className="detail-value">5 Seconds</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Posture Checks:</span>
                        <span className="detail-value">{postureSummary.total}</span>
                      </div>
                    </div>
                    
                    {selectedSession === index && (
                      <div className="session-expanded">
                        <div className="posture-breakdown">
                          <div className="breakdown-item">
                            <div className="breakdown-label">Good Posture</div>
                            <div className="breakdown-count">{postureSummary.upright}</div>
                          </div>
                          <div className="breakdown-item">
                            <div className="breakdown-label">Issues Detected</div>
                            <div className="breakdown-count">{postureSummary.issues}</div>
                          </div>
                        </div>
                        
                        {session.overallReport && (
                          <div className="session-report">
                            <h4>Session Report</h4>
                            <p>{session.overallReport}</p>
                          </div>
                        )}
                        
                        {session.recommendations && (
                          <div className="session-recommendations">
                            <h4>Recommendations</h4>
                            <p>{session.recommendations}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;