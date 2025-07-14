import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  feedback: { type: Array },
  overallReport: { type: String }
});

const Session = mongoose.model('Session', SessionSchema);

export default Session;
