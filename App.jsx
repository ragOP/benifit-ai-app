import React, { useEffect, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import Navigation from './src/navigation/navigation';

import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  // Request user permission for notifications
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  };

  // Handle permissions with status check
  const handlePermissions = async () => {
    try {
      const currentStatus = await messaging().hasPermission();

      if (currentStatus === messaging.AuthorizationStatus.AUTHORIZED) {
        console.log('✅ Firebase permission already granted');
      } else {
        const granted = await requestUserPermission();

        if (granted) {
          console.log('✅ Firebase permission granted successfully');
        } else {
          console.warn('🚫 Firebase permission denied');
        }
      }
    } catch (error) {
      console.error('❌ Error handling permissions:', error);
    }
  };

  // Create Android notification channel
  const createNotificationChannel = async () => {
    await notifee.createChannel({
      id: 'benefits',
      name: 'Benefits Notifications',
      description: 'Channel for benefits and updates',
      // importance: AndroidImportance.HIGH,
      // importance: notifee.AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
      lights: true,
      lightColor: '#0F766E',
      showBadge: true,
    });
  };

  // Display notification when message is received
  const onMessageReceived = useCallback(async (message) => {
    console.log('📱 Message received:', message);

    try {
      if (!message || !message.notification) {
        console.log('Message or notification is undefined, skipping');
        return;
      }

      const { title, body } = message.notification;

      if (!title || !body) {
        console.log('Missing title or body, skipping notification');
        return;
      }

      await notifee.displayNotification({
        title: title,
        body: body,
        data: message.data || {},
        android: {
          channelId: 'benefits',
          smallIcon: 'ic_launcher',
          // largeIcon: 'ic_launcher',
          color: '#0F766E',
          sound: 'default',
          vibrationPattern: [300, 500],
          // priority: notifee.AndroidImportance.HIGH,
          actions: [
            {
              title: 'View Details',
              pressAction: {
                id: 'view_details',
              },
            },
            {
              title: 'Dismiss',
              pressAction: {
                id: 'dismiss',
              },
            },
          ],
        },
        ios: {
          categoryId: 'benefits',
          threadId: 'benefits_thread',
        },
      });

      console.log('✅ Notification displayed successfully');

    } catch (error) {
      console.error('❌ Error displaying notification:', error);
    }
  }, []);

  // Register device and get FCM token
  const registerAndGetToken = async () => {
    try {
      console.log('📲 Registering for remote messages...');
      await messaging().registerDeviceForRemoteMessages();

      const token = await messaging().getToken();
      console.log('📩 FCM Token:', token);
      await AsyncStorage.setItem('fcmToken', token);
    } catch (error) {
      console.error('❌ Error getting FCM token:', error);
    }
  };

  // Foreground message listener
  useEffect(() => {
    const unsubscribe = messaging().onMessage(onMessageReceived);
    return unsubscribe;
  }, [onMessageReceived]);

  // Background message handler
  useEffect(() => {
    messaging().setBackgroundMessageHandler(onMessageReceived);
  }, [onMessageReceived]);

  // Initialize everything on mount
  useEffect(() => {
    console.log('🚀 App mounted');
    handlePermissions();
    createNotificationChannel();
    registerAndGetToken();
  }, []);

  return <Navigation />;
};

export default App;

const styles = StyleSheet.create({});
