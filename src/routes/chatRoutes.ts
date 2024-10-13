// src/routes/chatRoutes.ts
import express from 'express';
import { startChat, listChats, deleteChat, updateChat, getChat } from '../controllers/chatController';

const router = express.Router();

router.post('/', startChat);
router.get('/', listChats);
router.delete('/:chatId', deleteChat);
router.put('/:chatId', updateChat);
router.get('/:chatId', getChat);
export default router;