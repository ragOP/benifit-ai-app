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
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
    });
  };

  // Display notification when message is received
  const onMessageReceived = useCallback(async message => {
    console.log('📱 Message received:', message);

    try {
      if (!message || !message.data) {
        console.warn('⚠️ message or message.data is undefined');
        return;
      }

      const { totalUsers, successCount, failureCount, results, type } =
        message.data;

      if (
        totalUsers === undefined ||
        successCount === undefined ||
        failureCount === undefined
      ) {
        console.warn(
          '⚠️ Missing required fields in message data:',
          message.data,
        );
        return;
      }

      await notifee.displayNotification({
        title: getNotificationTitle(successCount, failureCount),
        body: getNotificationBody(totalUsers, successCount, failureCount),
        data: {
          totalUsers: totalUsers?.toString() || '0',
          successCount: successCount?.toString() || '0',
          failureCount: failureCount?.toString() || '0',
          results: results ? JSON.stringify(results) : '[]',
          type: type || 'notification',
        },
        android: {
          channelId: 'benefits',
          largeIcon: 'ic_launcher',
          color: getNotificationColor(successCount, failureCount),
          progress: {
            max: parseInt(totalUsers) || 0,
            current: parseInt(successCount) || 0,
            indeterminate: false,
          },
          actions: [
            {
              title: 'View Details',
              pressAction: { id: 'view_details' },
            },
            {
              title: 'Dismiss',
              pressAction: { id: 'dismiss' },
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
      console.error('Message that caused error:', message);
    }
  }, []);

  // Helper: Notification title
  const getNotificationTitle = (successCount, failureCount) => {
    if (parseInt(failureCount) === 0)
      return '✅ All Notifications Sent Successfully';
    if (parseInt(successCount) === 0) return '❌ All Notifications Failed';
    return '⚠️ Partial Success - Some Notifications Failed';
  };

  // Helper: Notification body
  const getNotificationBody = (totalUsers, successCount, failureCount) => {
    return `${successCount}/${totalUsers} successful • ${failureCount} failed`;
  };

  // Helper: Notification color
  const getNotificationColor = (successCount, failureCount) => {
    if (parseInt(failureCount) === 0) return '#10B981'; // Green
    if (parseInt(successCount) === 0) return '#EF4444'; // Red
    return '#F59E0B'; // Yellow
  };

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
