// src/routes/messageRoutes.ts
import express from 'express';
import { sendMessage, getMessages, updateMessage, deleteMessage, clearMessages } from '../controllers/messageController';
import authMiddleware from '../middleware/auth';
const router = express.Router();

router.post('/', sendMessage);
router.get('/:chatId', authMiddleware, getMessages);
router.put('/:messageId', authMiddleware, updateMessage);
router.delete('/:messageId', authMiddleware, deleteMessage);
router.delete('/clear/:chatId', authMiddleware, clearMessages);

export default router;