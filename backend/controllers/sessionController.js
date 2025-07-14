import Session from '../models/Session.js';

// Save session data to MongoDB
export const saveSession = async (req, res) => {
  try {
    const { feedback, overallReport } = req.body;
    const userId = req.auth?.payload?.sub;

    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in token.' });
    }

    const newSession = new Session({
      userId,
      feedback,
      overallReport,
    });

    await newSession.save();
    res.status(201).json({ message: 'Session saved successfully!' });
  } catch (error) {
    console.error('Error saving session:', error);
    res.status(500).json({ message: 'Failed to save session.' });
  }
};

// Get session reports for logged-in user
export const getSessions = async (req, res) => {
  try {
    const userId = req.auth?.payload?.sub;

    if (!userId) {
      return res.status(400).json({ message: 'User ID missing from token.' });
    }

    const sessions = await Session.find({ userId }).sort({ date: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Failed to retrieve sessions.' });
  }
};

// Session summary for charts
export const getSessionSummary = async (req, res) => {
  try {
    const userId = req.auth.payload.sub;

    const sessions = await Session.find({ userId });

    let slouchingSessions = 0;
    let uprightSessions = 0;

    sessions.forEach(session => {
      const report = session.overallReport?.toLowerCase() || '';
      if (report.includes("good posture")) {
        uprightSessions++;
      } else if (report.includes("slouch")) {
        slouchingSessions++;
      }
    });

    res.json({
      totalSessions: sessions.length,
      slouchingSessions,
      uprightSessions,
    });
  } catch (err) {
    console.error('Summary error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};





