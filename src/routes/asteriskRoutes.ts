import express from 'express';
import { originateChannel } from '../controllers/asteriskController';

const router = express.Router();

// Existing routes...
// router.get('/', ...);
// router.post('/', ...);

// New route to originate a channel
router.post('/originate', originateChannel);

export default router;