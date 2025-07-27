from flask import Flask, Response, jsonify
from flask_cors import CORS
import cv2
import mediapipe as mp
import numpy as np

app = Flask(__name__)
CORS(app)

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)
mp_drawing = mp.solutions.drawing_utils

# Drawing specifications
dot_spec = mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=1, circle_radius=1)
line_spec = mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=1)

# Global variable to store feedback
current_feedback = {
    "leaning_status": "Unknown",
    "posture": "Unknown",            # ✅ Add posture key (Upright or Slouching)
    "arms_status": "Unknown",
    "legs_status": "Unknown"
}

# Helper functions
def calculate_angle(a, b, c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    return 360 - angle if angle > 180.0 else angle

def calculate_distance(point1, point2):
    return np.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2)

def detect_leaning(landmarks):
    left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
    right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
    left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
    right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value]

    shoulder_mid = [(left_shoulder.x + right_shoulder.x) / 2, (left_shoulder.y + right_shoulder.y) / 2]
    hip_mid = [(left_hip.x + right_hip.x) / 2, (left_hip.y + right_hip.y) / 2]

    alignment = hip_mid[0] - shoulder_mid[0]
    return (
        "Leaning Forward" if alignment > -0.05 else
        "Leaning Backward" if alignment < 0.05 else
        "Upright",
        alignment
    )

def are_arms_folded(landmarks, threshold=0.1):
    lw, rw = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value], landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value]
    le, re = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value], landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value]
    return calculate_distance(lw, re) < threshold and calculate_distance(rw, le) < threshold

def are_legs_crossed(landmarks, threshold=0.1):
    lk, rk = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value], landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value]
    lh, rh = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value], landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value]
    return calculate_distance(lk, rh) < threshold or calculate_distance(rk, lh) < threshold

# Stream frames
def generate_frames():
    global current_feedback
    cap = cv2.VideoCapture(0)

    while True:
        success, frame = cap.read()
        if not success:
            break

        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        if results.pose_landmarks:
            lm = results.pose_landmarks.landmark

            # Back posture detection (shoulder-hip-knee angle)
            s = [lm[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, lm[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
            h = [lm[mp_pose.PoseLandmark.LEFT_HIP.value].x, lm[mp_pose.PoseLandmark.LEFT_HIP.value].y]
            k = [lm[mp_pose.PoseLandmark.LEFT_KNEE.value].x, lm[mp_pose.PoseLandmark.LEFT_KNEE.value].y]

            back_angle = calculate_angle(s, h, k)
            leaning_status, _ = detect_leaning(lm)

            current_feedback["leaning_status"] = leaning_status

            if 95 <= back_angle <= 110:
                current_feedback["posture"] = "Upright"
            elif back_angle < 95:
                current_feedback["posture"] = "Slouching"

            current_feedback["arms_status"] = "Arms Folded" if are_arms_folded(lm) else "Arms Not Folded"
            current_feedback["legs_status"] = "Legs Crossed" if are_legs_crossed(lm) else "Legs Not Crossed"

            # Draw text overlays
            cv2.putText(image, f'Leaning: {current_feedback["leaning_status"]}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,0), 2)
            cv2.putText(image, f'Back: {current_feedback["posture"]}', (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,0), 2)
            cv2.putText(image, f'Arms: {current_feedback["arms_status"]}', (10, 110), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,0,0), 2)
            cv2.putText(image, f'Legs: {current_feedback["legs_status"]}', (10, 150), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,0,255), 2)

            mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS, dot_spec, line_spec)

        ret, buffer = cv2.imencode('.jpg', image)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# Routes
@app.route('/')
def index():
    return "Posture Detection Server Running"

@app.route('/video')
def video():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/feedback')
def feedback():
    global current_feedback
    # ✅ Return a fully combined string for React to parse
    combined = f"{current_feedback['posture']} | {current_feedback['arms_status']} | {current_feedback['legs_status']} | {current_feedback['leaning_status']}"
    return jsonify({"feedback": combined})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001)

