import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { auth } from 'express-oauth2-jwt-bearer';

import sessionRoutes from './routes/sessionRoutes.js';
import { getSessionSummary } from './controllers/sessionController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  tokenSigningAlg: 'RS256'
});

// Protected routes
app.use('/api/sessions', checkJwt, sessionRoutes);

// Server listen
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
