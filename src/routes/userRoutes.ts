import express from 'express';
import {  listUsers, registerUser, loginUser, logoutUser, getMe } from '../controllers/userController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authMiddleware, logoutUser);
router.get('/', listUsers);
router.get('/me', authMiddleware, getMe);

export default router;