import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useAuth0 } from '@auth0/auth0-react';
import './Dashboard.css'; // Import the CSS file

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        const token = await getAccessTokenSilently({
          audience: 'https://posturedetectionapi',
        });

        const response = await fetch('http://localhost:5000/api/sessions/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch sessions');
        }

        const data = await response.json();
        setSessions(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError('Failed to load your session data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [getAccessTokenSilently]);

  // Aggregate counts from session feedback
  let upright = 0, slouching = 0, armsFolded = 0, legsCrossed = 0, leaningForward = 0, leaningBackward = 0;
  let totalFeedbackPoints = 0;

  sessions.forEach(session => {
    session.feedback?.forEach(fb => {
      const status = fb?.status || "";
      totalFeedbackPoints++;

      if (status.includes("Upright")) upright++;
      if (status.includes("Slouch")) slouching++;
      if (status.includes("Arms Folded")) armsFolded++;
      if (status.includes("Legs Crossed")) legsCrossed++;
      if (status.includes("Leaning Forward")) leaningForward++;
      if (status.includes("Leaning Backward")) leaningBackward++;
    });
  });

  const barData = {
    labels: ['Upright', 'Slouching', 'Leaning Forward', 'Leaning Backward', 'Arms Folded', 'Legs Crossed'],
    datasets: [
      {
        label: 'Posture Indicators',
        data: [upright, slouching, leaningForward, leaningBackward, armsFolded, legsCrossed],
        backgroundColor: [
          '#34d399', // green for upright
          '#f87171', // red for slouching
          '#fb923c', // orange for leaning forward
          '#60a5fa', // blue for leaning backward
          '#facc15', // yellow for arms folded
          '#a78bfa', // violet for legs crossed
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      title: { 
        display: true, 
        text: 'Posture Distribution Across All Sessions',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  if (isLoading) {
    return <div className="dashboard-loading">Loading your posture data...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Your Posture Dashboard</h1>
        <div className="dashboard-summary">
          <div className="summary-card">
            <h3>Total Sessions</h3>
            <p className="summary-value">{sessions.length}</p>
          </div>
          <div className="summary-card">
            <h3>Tracked Postures</h3>
            <p className="summary-value">{totalFeedbackPoints}</p>
          </div>
          <div className="summary-card good-posture">
            <h3>Upright Posture</h3>
            <p className="summary-value">{Math.round((upright / totalFeedbackPoints || 0) * 100)}%</p>
          </div>
          <div className="summary-card bad-posture">
            <h3>Poor Posture</h3>
            <p className="summary-value">{Math.round(((slouching + leaningForward + leaningBackward) / totalFeedbackPoints || 0) * 100)}%</p>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <Bar data={barData} options={options} />
      </div>

      <div className="dashboard-tips">
        <h2>Posture Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <h3>Adjust Your Screen</h3>
            <p>Position your screen at eye level to avoid looking down.</p>
          </div>
          <div className="tip-card">
            <h3>Take Breaks</h3>
            <p>Stand up and stretch every 30 minutes.</p>
          </div>
          <div className="tip-card">
            <h3>Sit Properly</h3>
            <p>Keep your back against the chair and feet flat on the floor.</p>
          </div>
          <div className="tip-card">
            <h3>Strengthen Core</h3>
            <p>Regular core exercises help maintain good posture.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;