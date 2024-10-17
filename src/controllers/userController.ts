import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user && (await bcrypt.compare(password, user.password || ''))) {
    res.json({
      id: user.id,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
export const logoutUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Since JWTs are stateless, logout can be handled by the client by deleting the token.
  // To implement server-side logout, you'd need to maintain a token blacklist.
  res.json({ message: 'Logged out successfully' });
});

// Generate JWT
const generateToken = (id: number) => {
  const secret = process.env.JWT_SECRET || 'your_jwt_secret';
  return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user; // This is populated by the authMiddleware
  console.log(user)
  if (user) {
    const user_res = await prisma.user.findUnique({
      where: { id: user.id },
    });
    if (user_res) {
      res.json({
        id: user_res.id,
        email: user_res.email,
      });
    } else {    
      res.status(404).json({ error: 'User not found' });
    }
  }
});

export const listUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  res.json(users);
});
