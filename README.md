# PostureTrack: AI-Powered Posture Monitoring System

## Project Overview
PostureTrack is a full-stack application that helps users improve their sitting habits using real-time AI-based posture monitoring. It provides instant feedback, analytics, and personalized recommendations to maintain proper alignment throughout the workday.

## Monorepo Structure
```
6SGP - Copy/
├── backend/              # Node.js + Express + MongoDB REST API
├── posture-detection/    # Python Flask server for real-time posture analysis
├── src/                  # React + Vite frontend
```

## Features
- Real-time posture monitoring using webcam and AI (MediaPipe, OpenCV)
- Instant feedback and alerts
- Analytics dashboard and progress tracking
- Secure authentication with Auth0
- Session history and reports
- Privacy-focused: all processing is local

## Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (v9+ recommended)
- **Python** (3.10.x recommended)
- **MongoDB** (local or cloud instance)
- **Git** (for version control)

## Setup Instructions

### 1. Clone the Repository
```sh
git clone <your-repo-url>
cd "6SGP - Copy"
```

### 2. Backend Setup (Node.js + Express)
```sh
cd backend
npm install
```

#### Create a `.env` file in `backend/` with the following variables:
```
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN
AUTH0_AUDIENCE=YOUR_AUTH0_AUDIENCE
```
> **Note:** Replace `YOUR_AUTH0_DOMAIN` and `YOUR_AUTH0_AUDIENCE` with your actual Auth0 credentials.

#### Start the backend server:
```sh
npm start # or: node server.js
```

### 3. Posture Detection Service Setup (Python + Flask)
```sh
cd ../posture-detection
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On Mac/Linux
pip install -r requirements.txt  # See below for generating this file
```

#### If `requirements.txt` does not exist, generate it after installing dependencies:
```sh
pip install flask flask-cors opencv-python mediapipe numpy
pip freeze > requirements.txt
```

#### Start the Flask server:
```sh
python app.py
```
- The service runs on `http://localhost:5001` by default and requires a webcam.

### 4. Frontend Setup (React + Vite)
```sh
cd ..
npm install
```

#### Start the frontend dev server:
```sh
npm run dev
```
- The app runs on `http://localhost:5173` by default.

## Environment Variables
- **Backend:** See above `.env` example.
- **Frontend:** Auth0 config is set in `src/main.jsx` using placeholders. For production, use your real Auth0 credentials.
- **Posture Detection:** No .env needed, but requires a webcam and Python 3.10+.

## Running the Project (All Together)
1. **Start MongoDB** (local or cloud)
2. **Start the backend** (`cd backend && npm start`)
3. **Start the posture-detection service** (`cd posture-detection && python app.py`)
4. **Start the frontend** (`npm run dev` from the root)

## API Endpoints

### Backend (`/backend`)
- `POST   /api/sessions/`         — Save a session (requires Auth0 JWT)
- `GET    /api/sessions/user`     — Get all sessions for the user
- `GET    /api/sessions/summary`  — Get session summary for charts

### Posture Detection (`/posture-detection`)
- `GET /`            — Health check
- `GET /video`       — MJPEG webcam video stream (for live analysis)
- `GET /feedback`    — JSON feedback on current posture

## Authentication (Auth0)
- The app uses Auth0 for authentication. Config is in `src/main.jsx`:
  - `domain`: `YOUR_AUTH0_DOMAIN`
  - `clientId`: `YOUR_AUTH0_CLIENT_ID`
  - `audience`: `YOUR_AUTH0_AUDIENCE`
- You must set up your own Auth0 tenant and fill in these values for your deployment.

## Data Model (MongoDB Session)
```js
{
  userId: String,         // Auth0 user sub
  date: Date,             // Session timestamp
  feedback: Array,        // Array of feedback strings
  overallReport: String   // Summary report
}
```

## Dependency Management & Best Practices
- **Never commit your Python virtual environment (`venv/`) or `node_modules/` to git.**
- Always use `.gitignore` to exclude these folders and large/binary files.
- Use `requirements.txt` for Python dependencies:
  - To update: `pip freeze > requirements.txt`
  - To install: `pip install -r requirements.txt`
- Use `package.json` for Node.js dependencies.
- If you accidentally committed large files, remove them with:
  ```sh
  git rm -r --cached posture-detection/venv
  git commit -m "Remove venv from git history"
  git push
  ```

## Contributing
1. Fork the repository and clone your fork.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with clear messages.
4. Push your branch and open a pull request.
5. Ensure you do **not** commit `venv/`, `node_modules/`, or any large/binary files.

## Troubleshooting
- **CORS errors:** Ensure all servers are running on the correct ports and CORS is enabled.
- **Auth errors:** Check your Auth0 domain, audience, and clientId.
- **MongoDB errors:** Verify your `MONGO_URI` and that MongoDB is running.
- **Webcam not detected:** Ensure your webcam is connected and not used by another app.
- **Python dependencies:** If posture-detection fails, check that all required Python packages are installed in the virtual environment.
- **GitHub push errors (large files):**
  - Make sure you are not tracking `venv/` or other large files. See above for removal instructions.
  - If you see errors about file size, use [Git Large File Storage (LFS)](https://git-lfs.github.com/) for assets, but **never for dependencies**.

## FAQ
**Q: Why shouldn't I commit my virtual environment or node_modules?**
A: These folders contain platform-specific, auto-generated files and can be very large. Use `requirements.txt` and `package.json` to share dependencies instead.

**Q: How do I update Python dependencies for the team?**
A: After installing or upgrading packages, run `pip freeze > requirements.txt` and commit the updated file.

**Q: I get a GitHub error about large files. What do I do?**
A: Remove the large files from git tracking (see above), update `.gitignore`, and push again.

**Q: How do I set up Auth0 for my own deployment?**
A: Create an Auth0 tenant, configure an application, and update the domain, clientId, and audience in your frontend and backend configs.

## License
MIT (or specify your license)
