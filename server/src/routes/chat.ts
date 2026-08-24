import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../lib/auth';

const router = Router();

export function formatMessage(msg: any) {
  if (!msg) return null;
  return {
    ...msg,
    attachments: JSON.parse(msg.attachments || '[]'),
  };
}

// Get User Conversations list
router.get('/conversations', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id!;

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { participantAId: userId },
          { participantBId: userId }
        ]
      },
      orderBy: { lastMessageTime: 'desc' }
    });

    const formattedConversations = await Promise.all(
      conversations.map(async (c) => {
        const otherUserId = c.participantAId === userId ? c.participantBId : c.participantAId;
        
        // Fetch other user profile info
        const otherUser = await prisma.user.findUnique({
          where: { id: otherUserId }
        });

        // Compute unread messages count sent by the other participant
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: c.id,
            senderId: otherUserId,
            isRead: false
          }
        });

        return {
          id: c.id,
          participant: {
            id: otherUserId,
            name: otherUser?.name || 'Unknown User',
            avatar: otherUser?.avatar || '',
            role: otherUser?.role || 'freelancer',
            isOnline: false // static fallback
          },
          lastMessage: c.lastMessage || '',
          lastMessageTime: c.lastMessageTime.toISOString(),
          unreadCount
        };
      })
    );

    return res.json(formattedConversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Messages for a Conversation
router.get('/conversations/:id/messages', authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id!;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (conversation.participantAId !== userId && conversation.participantBId !== userId) {
      return res.status(403).json({ error: 'Access denied: you are not a participant in this conversation' });
    }

    // Mark messages from the other user as read
    await prisma.message.updateMany({
      where: {
        conversationId: id,
        recipientId: userId,
        isRead: false
      },
      data: { isRead: true }
    });

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { timestamp: 'asc' }
    });

    return res.json(messages.map(formatMessage));
  } catch (error) {
    console.error('Get messages error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Send a Message
router.post('/conversations/:id/messages', authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { text, attachments } = req.body;
  const userId = req.user?.id!;

  if (!text && (!attachments || attachments.length === 0)) {
    return res.status(400).json({ error: 'Message body or attachment required' });
  }

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const sender = await prisma.user.findUnique({ where: { id: userId } });
    if (!sender) return res.status(404).json({ error: 'Sender not found' });

    const recipientId = conversation.participantAId === userId ? conversation.participantBId : conversation.participantAId;

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: userId,
        senderName: sender.name,
        senderAvatar: sender.avatar,
        recipientId,
        text: text || '',
        attachments: JSON.stringify(attachments || []),
        isRead: false
      }
    });

    // Update conversation last message details
    await prisma.conversation.update({
      where: { id },
      data: {
        lastMessage: text || '[Attachment]',
        lastMessageTime: new Date()
      }
    });

    return res.status(201).json(formatMessage(message));
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or Get Conversation with another user
router.post('/conversations', authenticateToken, async (req: AuthRequest, res) => {
  const { participantId } = req.body;
  const userId = req.user?.id!;

  if (!participantId) {
    return res.status(400).json({ error: 'Participant ID is required' });
  }

  try {
    const otherUser = await prisma.user.findUnique({ where: { id: participantId } });
    if (!otherUser) {
      return res.status(404).json({ error: 'Participant user not found' });
    }

    // Check if conversation already exists between these two users
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { participantAId: userId, participantBId: participantId },
          { participantAId: participantId, participantBId: userId }
        ]
      }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantAId: userId,
          participantBId: participantId,
          lastMessage: 'Conversation started',
          lastMessageTime: new Date()
        }
      });
    }

    return res.json({
      id: conversation.id,
      participant: {
        id: otherUser.id,
        name: otherUser.name,
        avatar: otherUser.avatar,
        role: otherUser.role,
        isOnline: false
      },
      lastMessage: conversation.lastMessage || '',
      lastMessageTime: conversation.lastMessageTime.toISOString(),
      unreadCount: 0
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
