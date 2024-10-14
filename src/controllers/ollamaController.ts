import { Request, Response } from 'express';
import { Ollama } from 'ollama';

// Initialize the Ollama client
const ollama = new Ollama({ host: 'http://localhost:11434' });

/**
 * Handle chat requests
 */
export const chat = async (req: Request, res: Response) => {
    const { model, messages, stream, keep_alive, options } = req.body;

    try {
        const response = await ollama.chat({
            model,
            messages,
            stream: stream || false,
            keep_alive: keep_alive || undefined,
            options: options || undefined,
        });

        res.json(response);
    } catch (error) {
        console.error('Ollama Chat Error:', error);
        res.status(500).json({ error: 'Failed to process chat request.' });
    }
};

/**
 * Handle generate requests
 */
export const generate = async (req: Request, res: Response) => {
    const { model, prompt, suffix, system, template, raw, images, format, stream, keep_alive, options } = req.body;

    try {
        const response = await ollama.generate({
            model,
            prompt,
            suffix: suffix || undefined,
            system: system || undefined,
            template: template || undefined,
            raw: raw || false,
            images: images || undefined,
            format: format || 'json',
            stream: stream || false,
            keep_alive: keep_alive || undefined,
            options: options || undefined,
        });

        res.json(response);
    } catch (error) {
        console.error('Ollama Generate Error:', error);
        res.status(500).json({ error: 'Failed to process generate request.' });
    }
};

/**
 * Handle list models
 */
export const listModels = async (req: Request, res: Response) => {
    try {
        const response = await ollama.list();
        res.json(response);
    } catch (error) {
        console.error('Ollama List Models Error:', error);
        res.status(500).json({ error: 'Failed to list models.' });
    }
};

// You can add more controller functions for other Ollama API methods as needed