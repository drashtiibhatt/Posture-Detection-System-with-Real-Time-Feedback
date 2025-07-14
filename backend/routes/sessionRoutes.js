import express from 'express';
import { saveSession, getSessions, getSessionSummary } from '../controllers/sessionController.js';

const router = express.Router();

router.post('/', saveSession);
router.get('/user', getSessions);
router.get('/summary', getSessionSummary);

export default router;
