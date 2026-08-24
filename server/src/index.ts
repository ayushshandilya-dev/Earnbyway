import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import { Server } from 'socket.io';
import * as dotenv from 'dotenv';
import authRoutes from './routes/auth';
import gigRoutes from './routes/gigs';
import projectRoutes from './routes/projects';
import orderRoutes from './routes/orders';
import chatRoutes from './routes/chat';
import earningsRoutes from './routes/earnings';
import adminRoutes from './routes/admin';
import { rateLimiter } from './middleware/rateLimiter';
import prisma from './lib/prisma';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Create HTTP server
const server = http.createServer(app);

// Configure Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // In production, replace with specific frontend domains
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes with rate limiting on critical auth and payment endpoints
app.use('/api/auth', rateLimiter(50, 15 * 60 * 1000), authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/earnings', rateLimiter(100, 15 * 60 * 1000), earningsRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'EarnByWay API Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

// Socket.io handlers
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // User joins a conversation room
  socket.on('join_room', (conversationId: string) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation room: ${conversationId}`);
  });

  // User sends a message
  socket.on('send_message', async (data: {
    conversationId: string;
    senderId: string;
    senderName: string;
    senderAvatar: string;
    content: string;
    attachments?: string[];
  }) => {
    const { conversationId, senderId, senderName, senderAvatar, content, attachments } = data;

    try {
      // Find the conversation to get the recipient ID
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId }
      });

      if (!conversation) {
        socket.emit('message_error', { error: 'Conversation not found' });
        return;
      }

      const recipientId = conversation.participantAId === senderId ? conversation.participantBId : conversation.participantAId;

      // Save message to database
      const message = await prisma.message.create({
        data: {
          conversationId,
          senderId,
          senderName,
          senderAvatar,
          recipientId,
          text: content || '',
          attachments: JSON.stringify(attachments || []),
          isRead: false
        },
      });

      // Update the conversation's lastMessage details
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessage: content || '[Attachment]',
          lastMessageTime: new Date()
        },
      });

      // Broadcast formatted message to everyone in the room
      io.to(conversationId).emit('receive_message', {
        ...message,
        attachments: attachments || []
      });
    } catch (error) {
      console.error('Socket send_message error:', error);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });

  // User is typing indicator
  socket.on('typing', (data: { conversationId: string; senderId: string; isTyping: boolean }) => {
    socket.to(data.conversationId).emit('user_typing', data);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`EarnByWay Backend Server successfully listening on port ${PORT}`);
});
