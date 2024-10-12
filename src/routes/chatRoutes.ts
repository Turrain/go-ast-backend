// src/routes/chatRoutes.ts
import express from 'express';
import { startChat, listChats } from '../controllers/chatController';

const router = express.Router();

router.post('/', startChat);
router.get('/', listChats);

export default router;