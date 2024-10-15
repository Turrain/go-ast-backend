// src/routes/messageRoutes.ts
import express from 'express';
import { sendMessage, getMessages, updateMessage, deleteMessage, clearMessages } from '../controllers/messageController';

const router = express.Router();

router.post('/', sendMessage);
router.get('/:chatId', getMessages);
router.put('/:messageId', updateMessage);
router.delete('/:messageId', deleteMessage);
router.delete('/clear/:chatId', clearMessages);

export default router;