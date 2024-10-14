import express from 'express';
import { chat, generate, listModels } from '../controllers/ollamaController';

const router = express.Router();

// POST /ollama/chat - Handle chat interactions
router.post('/chat', chat);

// POST /ollama/generate - Handle text generation
router.post('/generate', generate);

// GET /ollama/models - List available models
router.get('/models', listModels);

export default router;