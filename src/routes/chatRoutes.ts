// src/routes/chatRoutes.ts
import express from 'express';
import { startChat, listChats, deleteChat, updateChat, getChat } from '../controllers/chatController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, startChat);
router.get('/', authMiddleware, listChats);
router.delete('/:chatId', authMiddleware, deleteChat);
router.put('/:chatId', authMiddleware, updateChat);
router.get('/:chatId', getChat);
export default router;