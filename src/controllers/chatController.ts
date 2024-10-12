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