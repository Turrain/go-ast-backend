// src/controllers/chatController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const startChat = async (req: AuthRequest, res: Response) => {
  const { id } = req.user;
  console.log("userId", id);
  try {
    const chat = await prisma.chat.create({
      data: { userId: id },
    });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to start chat' });
  }
};

export const listChats = async (req: AuthRequest, res: Response) => {
  const { id } = req.user;
  try {
    const chats = await prisma.chat.findMany({
      where: { userId: id },
      include: { messages: true },
      orderBy: {
        startTime: 'desc',
      },
    });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list chats' });
  }
};

export const deleteChat = async (req: AuthRequest, res: Response) => {
  const { chatId } = req.params;
  const { id } = req.user;
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId, userId: id },
    });
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Delete related messages first
    await prisma.message.deleteMany({
      where: { chatId },
    });

    // Now delete the chat
    await prisma.chat.delete({
      where: { id: chatId },
    });

    res.json({ message: 'Chat deleted successfully' });
  } catch (err) {
    console.error('Error deleting chat:', err);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
};

export const updateChat = async (req: AuthRequest, res: Response) => {

  const { chatId } = req.params;
  const {endTime, settings, llmSettings, sttSettings,title } = req.body;
  const { id } = req.user;
  try {
    const chat = await prisma.chat.update({
      where: { id: chatId, userId: id },
      data: { endTime, settings, llmSettings, sttSettings, title },
    });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update chat' });
  }
};

export const getChat = async (req: Request, res: Response) => {
  const { chatId } = req.params;

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { messages: true },
    });
    if (chat) {
      res.json(chat);
    } else {
      res.status(404).json({ error: 'Chat not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to get chat' });
  }
};
