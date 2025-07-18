import axios from 'axios';

const API_URL = 'http://localhost:5000/api/sessions';

// Save a session to the database
export const saveSession = async (sessionData, token) => {
  try {
    const response = await axios.post(API_URL, sessionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error saving session:', error);
    throw error;
  }
};

// Fetch all sessions for the current user
export const getSessions = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
};

// Fetch summarized session data (e.g. posture distribution)
export const fetchSessionSummary = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching session summary:', error);
    throw error;
  }
};

