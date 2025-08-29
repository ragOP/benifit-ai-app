// ChatService.js - Service for handling chat functionality
import { BACKEND_URL } from '../utils/backendUrl';

// Mock data for development - replace with actual API calls
const mockMessages = [
  {
    id: '1',
    text: 'Hello! How can I help you today?',
    sender: 'admin',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: true,
  },
  {
    id: '2',
    text: 'I have a question about my benefits',
    sender: 'user',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    read: true,
  },
  {
    id: '3',
    text: 'Sure! What would you like to know?',
    sender: 'admin',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    read: true,
  },
  {
    id: '4',
    text: 'Can you explain the dental coverage?',
    sender: 'user',
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
    read: false,
  },
];

// Fetch chat messages
export const getMessages = async () => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, replace with actual API call:
    // const response = await fetch(`${BACKEND_URL}/api/chat/messages`);
    // return await response.json();
    
    return {
      success: true,
      data: mockMessages,
      message: 'Messages fetched successfully'
    };
  } catch (error) {
    console.error('Error fetching messages:', error);
    return {
      success: false,
      data: [],
      message: 'Failed to fetch messages'
    };
  }
};

// Send a new message
export const sendMessage = async (messageData) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMessage = {
      id: Date.now().toString(),
      text: messageData.text,
      sender: messageData.sender || 'user',
      timestamp: new Date(),
      read: false,
    };

    // In production, replace with actual API call:
    // const response = await fetch(`${BACKEND_URL}/api/chat/send`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(messageData),
    // });
    // return await response.json();

    return {
      success: true,
      data: newMessage,
      message: 'Message sent successfully'
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      success: false,
      data: null,
      message: 'Failed to send message'
    };
  }
};

// Mark messages as read
export const markAsRead = async (messageIds) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In production, replace with actual API call:
    // const response = await fetch(`${BACKEND_URL}/api/chat/mark-read`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ messageIds }),
    // });
    // return await response.json();

    return {
      success: true,
      message: 'Messages marked as read'
    };
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return {
      success: false,
      message: 'Failed to mark messages as read'
    };
  }
};

// Get unread message count
export const getUnreadCount = async () => {
  try {
    const messages = await getMessages();
    if (messages.success) {
      const unreadCount = messages.data.filter(msg => !msg.read && msg.sender === 'admin').length;
      return {
        success: true,
        data: unreadCount
      };
    }
    return { success: false, data: 0 };
  } catch (error) {
    console.error('Error getting unread count:', error);
    return { success: false, data: 0 };
  }
};

// Get chat status (online/offline)
export const getChatStatus = async () => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // In production, replace with actual API call:
    // const response = await fetch(`${BACKEND_URL}/api/chat/status`);
    // return await response.json();

    return {
      success: true,
      data: {
        status: 'online',
        lastSeen: new Date(),
        responseTime: '2-5 minutes'
      }
    };
  } catch (error) {
    console.error('Error getting chat status:', error);
    return {
      success: false,
      data: {
        status: 'offline',
        lastSeen: null,
        responseTime: 'Unknown'
      }
    };
  }
}; 