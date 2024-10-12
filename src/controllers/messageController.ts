// src/controllers/messageController.ts
import { Request, Response } from 'express';
import { PrismaClient, Sender } from '@prisma/client';

const prisma = new PrismaClient();

export const sendMessage = async (req: Request, res: Response) => {
  const { chatId, sender, content } = req.body;
  try {
    const message = await prisma.message.create({
      data: { chatId, sender: sender as Sender, content },
    });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: { chatId: (chatId) },
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};