import { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { saveSession } from '../services/sessionService';
import './LiveAnalysis.css'; // You'll need to create this CSS file

function LiveAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);
  const [intervalId, setIntervalId] = useState(null);
  const { getAccessTokenSilently, user } = useAuth0();

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setFeedbackData([]);
    const id = setInterval(fetchFeedback, 5000);
    setIntervalId(id);
  };

  const stopAnalysis = async () => {
    setIsAnalyzing(false);
    clearInterval(intervalId);
  
    if (feedbackData.length > 0) {
      let upright = 0, slouch = 0, armsFolded = 0, legsCrossed = 0;
  
      feedbackData.forEach(f => {
        const status = f.status || "";
        if (status.includes("Upright")) upright++;
        if (status.includes("Slouch")) slouch++;
        if (status.includes("Arms Folded")) armsFolded++;
        if (status.includes("Legs Crossed")) legsCrossed++;
      });
  
      const overallReport = `
        Good posture: ${upright}, 
        Slouching: ${slouch}, 
        Arms Folded: ${armsFolded}, 
        Legs Crossed: ${legsCrossed}
      `.trim();
  
      const sessionData = {
        userId: user.sub,
        feedback: feedbackData,
        overallReport
      };
  
      try {
        const token = await getAccessTokenSilently({
          audience: 'https://posturedetectionapi',
          scope: 'read:session'
        });
  
        console.log("Sending session:", sessionData);
        await saveSession(sessionData, token);
        alert('Session saved successfully!');
      } catch (error) {
        console.error('Error saving session:', error.response?.data || error.message);
        alert('Failed to save session.');
      }
    }
  };  

  const fetchFeedback = async () => {
    try {
      const response = await axios.get('http://localhost:5001/feedback');
      const newFeedback = {
        time: new Date().toLocaleTimeString(),
        status: response.data.feedback
      };
      setFeedbackData(prev => [...prev, newFeedback]);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  return (
    <div className="live-analysis-container">
      <h1 className="analysis-title">Live Posture Analysis</h1>
      
      <div className="control-panel">
        {!isAnalyzing ? (
          <button 
            className="control-button start-button" 
            onClick={startAnalysis}
          >
            Start Analysis
          </button>
        ) : (
          <button 
            className="control-button stop-button" 
            onClick={stopAnalysis}
          >
            Stop Analysis & Save Session
          </button>
        )}
      </div>

      {isAnalyzing && (
        <div className="analysis-content">
          <div className="video-container">
            <img
              src="http://localhost:5001/video"
              alt="Live Posture Feed"
              className="video-feed"
            />
          </div>
          
          <div className="feedback-container">
            <h2 className="feedback-title">Real-time Feedback</h2>
            <div className="feedback-list">
              {feedbackData.length > 0 ? (
                feedbackData.map((item, index) => (
                  <div 
                    key={index} 
                    className={`feedback-item ${
                      item.status.includes("Upright") ? "good-posture" : "bad-posture"
                    }`}
                  >
                    <span className="feedback-time">{item.time}</span>
                    <span className="feedback-status">{item.status}</span>
                  </div>
                ))
              ) : (
                <p className="no-feedback">Waiting for posture data...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveAnalysis;