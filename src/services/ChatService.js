// ChatService.js - Service for handling chat functionality
import { BACKEND_URL } from '../utils/backendUrl';

// GET: Fetch chat messages
export const getMessages = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/chat/get-chat`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return {
      success: false,
      data: [],
      message: 'Failed to fetch messages',
    };
  }
};

// POST: Send a new message
export const sendMessage = async ({ payload }) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      success: false,
      data: null,
      message: 'Failed to send message',
    };
  }
};
