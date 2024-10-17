// src/controllers/messageController.ts
import { Request, Response } from 'express';
import { PrismaClient, Sender } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const sendMessage = async (req: Request, res: Response) => {
  const { chatId, role, content } = req.body;
  
  console.log('Received message:', { chatId, role, content });
  try {
    const message = await prisma.message.create({
      data: { chatId, role, content },
      
    });
    // Emit event for real-time updates
    req.app.get('io').to(chatId).emit('newMessage', message);
    console.log('New message sent:', message);
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const clearMessages = async (req: AuthRequest, res: Response) => {
  const { chatId } = req.params;
  try {
      await prisma.message.deleteMany({
          where: { chatId },
      });
      // Emit event for real-time updates
      req.app.get('io').to(chatId).emit('clearMessages');
      res.json({ message: 'All messages cleared successfully' });
  } catch (err) {
      res.status(500).json({ error: 'Failed to clear messages' });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  const { chatId } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { sentAt: 'asc' },
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

export const updateMessage = async (req: AuthRequest, res: Response) => {
  const { messageId } = req.params;
  const { content } = req.body;
  try {
    const message = await prisma.message.update({
      where: { id: parseInt(messageId, 10) },
      data: { content },
    });
    // Emit event for real-time updates
    req.app.get('io').to(message.chatId).emit('updateMessage', message);
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update message' });
  }
};

export const deleteMessage = async (req: AuthRequest, res: Response) => {
  const { messageId } = req.params;
  try {
    const message = await prisma.message.findUnique({
      where: { id: parseInt(messageId, 10) },
    });
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    await prisma.message.delete({
      where: { id: parseInt(messageId, 10) },
    });
    // Emit event for real-time updates
    req.app.get('io').to(message.chatId).emit('deleteMessage', { id: messageId });
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
};