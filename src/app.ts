import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import userRoutes from './routes/userRoutes';
import chatRoutes from './routes/chatRoutes';
import messageRoutes from './routes/messageRoutes';
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());
// Register routers
app.use('/users', userRoutes);
app.use('/chats', chatRoutes);
app.use('/messages', messageRoutes);

// Create a default user if it does not exist
const createDefaultUser = async () => {
  const defaultUser = await prisma.user.findUnique({
    where: { email: 'default@example.com' },
  });

  if (!defaultUser) {
    await prisma.user.create({
      data: {
        username: 'defaultuser',
        email: 'default@example.com',
        password: 'defaultpassword', // Consider hashing passwords
      },
    });
    console.log('Default user created');
  } else {
    console.log('Default user already exists');
  }
};

createDefaultUser();
// Start the server
const PORT = process.env.PORT || 8009;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});