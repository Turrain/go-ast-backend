import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSttSettings = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { settings: true },
    });
    if (chat) {
      res.json(chat.settings.sttSettings);
    } else {
      res.status(404).json({ error: 'Chat not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve STT settings' });
  }
};

export const updateSttSettings = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const { newSttSettings } = req.body;
  try {
    const chat = await prisma.chat.update({
      where: { id: chatId },
      data: { sttSettings: newSttSettings },
    });
    res.json(chat.sttSettings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update STT settings' });
  }
};

// Similar functions for llmSettings and ttsSettings
export const getLlmSettings = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { settings: true },
    });
    if (chat) {
        console.log(chat);
      res.json(chat.settings.llmSettings);
    } else {
      res.status(404).json({ error: 'Chat not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve LLM settings' });
  }
};

export const updateLlmSettings = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const { newLlmSettings } = req.body;
  try {
    const chat = await prisma.chat.update({
      where: { id: chatId },
      data: { llmSettings: newLlmSettings },
    });
    res.json(chat.llmSettings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update LLM settings' });
  }
};

export const getTtsSettings = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { ttsSettings: true },
    });
    if (chat) {
      res.json(chat.ttsSettings);
    } else {
      res.status(404).json({ error: 'Chat not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve TTS settings' });
  }
};

export const updateTtsSettings = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const { newTtsSettings } = req.body;
  try {
    const chat = await prisma.chat.update({
      where: { id: chatId },
      data: { ttsSettings: newTtsSettings },
    });
    res.json(chat.ttsSettings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update TTS settings' });
  }
};