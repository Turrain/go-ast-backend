import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import cors from "cors";
import http from 'http';
dotenv.config();
import userRoutes from './routes/userRoutes';
import chatRoutes from './routes/chatRoutes';
import messageRoutes from './routes/messageRoutes';
import ollamaRoutes from "./routes/ollamaRoutes";
import asteriskRoutes from "./routes/asteriskRoutes";
import { Server } from "socket.io";
const app = express();
const prisma = new PrismaClient();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this in production
    methods: ["GET", "POST"]
  }
});
app.use((req, res, next) => {
  req.app.set('io', io);
  next();
});
app.use(express.json());
app.use(cors());
// Register routers
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ollama', ollamaRoutes);
app.use('/api/asterisk', asteriskRoutes);
// Create a default user if it does not exist
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  // Join a chat room
  socket.on('joinChat', (chatId: string) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined chat ${chatId}`);
  });

  // Leave a chat room
  socket.on('leaveChat', (chatId: string) => {
    socket.leave(chatId);
    console.log(`Socket ${socket.id} left chat ${chatId}`);
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected:', socket.id);
  });
});


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
const createDefaultChat = async () => {
  const chats = await prisma.chat.findMany();
  
  if (chats.length === 0) {
    const defaultUser = await prisma.user.findUnique({
      where: { email: 'default@example.com' },
    });

    if (defaultUser) {
      await prisma.chat.create({
        data: {
          userId: defaultUser.id,
        
        },
      });
      console.log('Default chat created');
    } else {
      console.log('Default user not found, cannot create default chat');
    }
  } else {
    console.log('Chats already exist');
  }
};

createDefaultChat();

createDefaultUser();
// Start the server
const PORT = process.env.PORT || 8009;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});