import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView as RNSafeAreaView,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'react-native-linear-gradient';
import { getMessages, sendMessage } from '../services/ChatService';
import { SafeAreaView as ContextSafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Conditionally use SafeAreaView based on platform
const SafeAreaView = Platform.OS === 'ios' ? RNSafeAreaView : ContextSafeAreaView;

const COLORS = {
  primary: '#0F766E',
  primaryDark: '#0A6A5C',
  secondary: '#2FBF9A',
  background: '#f6f7f2',
  white: '#ffffff',
  text: '#121517',
  textLight: '#6b7a78',
  border: '#E5E7EB',
  userBubble: '#0F766E',
  adminBubble: '#E7F4F1',
  userText: '#ffffff',
  adminText: '#121517',
};

const MessageBubble = ({ message }) => {
  const isUser = message?.role?.toLowerCase() === 'user';
  const bubbleStyle = isUser ? styles.userBubble : styles.adminBubble;
  const textStyle = isUser ? styles.userText : styles.adminText;

  const formatTime = timestamp => {
    const now = new Date();
    const past = new Date(timestamp);
    const diff = now - past;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <View
      style={[
        styles.messageContainer,
        isUser ? styles.userContainer : styles.adminContainer,
      ]}
    >
      {!isUser && (
        <View style={styles.adminAvatar}>
          <MaterialIcon name="headset" size={20} color={COLORS.primary} />
        </View>
      )}
      <View
        style={[styles.messageContent, isUser && styles.userMessageContent]}
      >
        <View style={[styles.bubble, bubbleStyle]}>
          <Text style={[styles.messageText, textStyle]}>{message?.text}</Text>
        </View>
        <Text style={styles.timestamp}>{formatTime(message?.createdAt)}</Text>
      </View>
      {isUser && (
        <View style={styles.userAvatar}>
          <MaterialIcon name="account-circle" size={20} color={COLORS.white} />
        </View>
      )}
    </View>
  );
};

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isFirstMsg, setIsFirstMsg] = useState(true);
  const flatListRef = useRef(null);
  const queryClient = useQueryClient();

  // TanStack Query for fetching messages
  const { data: chatMessages = [], isLoading } = useQuery({
    queryKey: ['chatMessages'],
    queryFn: async () => {
      const conversationId = await AsyncStorage.getItem('conversationId');
      const response = conversationId && (await getMessages(conversationId));
      // return response.success ? response.data : [];
      if (response?.success) {
        setIsFirstMsg(!response?.data?.length > 0);
        return response.data;
      }
      return [];
    },
    // refetch after 2 secondds
    refetchInterval: 2000,
    initialData: [],
  });
  console.log('chatMessages >>>', chatMessages);
  console.log('isFirstMsg >>>', isFirstMsg);

  // TanStack Query mutation for sending messages
  const sendMessageMutation = useMutation({
    mutationFn: async messageText => {
      let payload = {};
      const userId = await AsyncStorage.getItem('userId');
      console.log('userId >>>', userId);
      const adminId = '68b2e2f6254442f9db4ae935';
      if (!isFirstMsg) {
        const conversationId = await AsyncStorage.getItem('conversationId');
        payload = {
          userId,
          adminId,
          conversationId,
          text: messageText,
          role: 'User',
        };
      } else {
        payload = {
          userId,
          adminId,
          text: messageText,
          role: 'User',
        };
      }
      const response = await sendMessage({ payload });
      return response.success ? response.data : null;
    },
    onSuccess: async data => {
      if (data?.result) {
        const newMessage = data.result;
        const conversationId = newMessage?.conversationId;
        await AsyncStorage.setItem('conversationId', conversationId);
        setMessages(prev => [...prev, newMessage]);
        queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
      }
    },
    onError: error => {
      console.error('Error sending message:', error);
    },
  });

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessageMutation.mutate(message.trim());
      setMessage('');
    }
  };

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  // Sync messages from query with local state
  useEffect(() => {
    if (chatMessages && chatMessages.length > 0) {
      setMessages(chatMessages);
    }
  }, [chatMessages]);

  // clean message when component unmounts
  useEffect(() => {
    return () => {
      setMessages([]);
    };
  }, []);

  const renderMessage = ({ item }) => (
    <MessageBubble message={item} isAdmin={false} />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background}
        />
        <View style={styles.loadingContainer}>
          <MaterialIcon
            name="chat-processing"
            size={48}
            color={COLORS.primary}
          />
          <Text style={styles.loadingText}>Loading chat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <MaterialIcon name="chat" size={28} color={COLORS.white} />
          <Text style={styles.headerTitle}>Support Chat</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={() =>
                queryClient.invalidateQueries({ queryKey: ['chatMessages'] })
              }
            >
              <MaterialIcon name="refresh" size={20} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.statusIndicator}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            placeholderTextColor={COLORS.textLight}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isPending}
          >
            <MaterialIcon
              name="send"
              size={24}
              color={message.trim() ? COLORS.white : COLORS.textLight}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 16,
  },
  header: {
    // paddingTop: 16,
    // paddingBottom: 20,
    // paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.white,
    flex: 1,
    marginLeft: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '500',
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  adminContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: COLORS.userBubble,
    borderBottomRightRadius: 6,
    marginRight: 8,
  },
  adminBubble: {
    backgroundColor: COLORS.adminBubble,
    borderBottomLeftRadius: 6,
    marginLeft: 8,
  },
  messageContent: {
    flex: 1,
    alignItems: 'flex-start',
  },
  userMessageContent: {
    alignItems: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: COLORS.userText,
  },
  adminText: {
    color: COLORS.adminText,
  },
  timestamp: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 4,
    marginLeft: 10,
    marginRight: 10,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  adminAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginTop: 8,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: Platform.OS === 'ios' ? 16 : 0
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    // maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.border,
  },
});

export default ChatScreen;
