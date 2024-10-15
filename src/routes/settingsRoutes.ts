import express from 'express';
import { getSttSettings, updateSttSettings, getLlmSettings, updateLlmSettings, getTtsSettings, updateTtsSettings } from '../controllers/settingsController';

const router = express.Router();

router.get('/:chatId/stt', getSttSettings);
router.put('/:chatId/stt', updateSttSettings);

router.get('/:chatId/llm', getLlmSettings);
router.put('/:chatId/llm', updateLlmSettings);

router.get('/:chatId/tts', getTtsSettings);
router.put('/:chatId/tts', updateTtsSettings);

export default router;