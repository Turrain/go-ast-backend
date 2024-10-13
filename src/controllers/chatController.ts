// src/controllers/chatController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const startChat = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    const chat = await prisma.chat.create({
      data: { userId },
    });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to start chat' });
  }
};

export const listChats = async (req: Request, res: Response) => {
  try {
    const chats = await prisma.chat.findMany({
      include: { messages: true },
    });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list chats' });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
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

export const updateChat = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const { userId, endTime, settings } = req.body;
  try {
    const chat = await prisma.chat.update({
      where: { id: chatId },
      data: { userId, endTime, settings },
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