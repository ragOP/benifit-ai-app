import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useCallback } from 'react';
import Navigation from './src/navigation/navigation';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { getFCMToken } from './src/services/NotificationService';

const App = () => {
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.info('Authorization status:', authStatus);
    }
  }


  // Create notification channel for Android
  const createNotificationChannel = async () => {
    await notifee.createChannel({
      id: 'benefits',
      name: 'Benefits Notifications',
      description: 'Channel for benefits and updates',
      importance: notifee.AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
    });
  };

  // Handle Firebase messages with @notifee
  const onMessageReceived = useCallback(async (message) => {
    console.log('📱 Message received:', message);
    
    try {
      // Validate message structure
      if (!message || !message.data) {
        console.log('⚠️ Message or message.data is undefined, skipping notification');
        return;
      }

      const { totalUsers, successCount, failureCount, results, type } = message.data;
      
      // Validate required fields
      if (totalUsers === undefined || successCount === undefined || failureCount === undefined) {
        console.log('⚠️ Missing required fields in message data:', message.data);
        return;
      }

      // Create beautiful native notification
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
            max: totalUsers || 0,
            current: successCount || 0,
            indeterminate: false,
          },
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
      console.error('Message that caused error:', message);
    }
  }, []);

  // Get notification title based on results
  const getNotificationTitle = (successCount, failureCount) => {
    if (failureCount === 0) return '✅ All Notifications Sent Successfully';
    if (successCount === 0) return '❌ All Notifications Failed';
    return '⚠️ Partial Success - Some Notifications Failed';
  };

  // Get notification body with summary
  const getNotificationBody = (totalUsers, successCount, failureCount) => {
    return `${successCount}/${totalUsers} successful • ${failureCount} failed`;
  };

  // Get notification color based on results
  const getNotificationColor = (successCount, failureCount) => {
    if (failureCount === 0) return '#10B981'; // Green
    if (successCount === 0) return '#EF4444'; // Red
    return '#F59E0B'; // Yellow
  };

  // Handle foreground messages
  useEffect(() => {
    const unsubscribe = messaging().onMessage(onMessageReceived);
    return unsubscribe;
  }, []);

  // Handle background messages
  useEffect(() => {
    messaging().setBackgroundMessageHandler(onMessageReceived);
  }, []);

  // Initialize notification system
  useEffect(() => {
    console.log('App mounted');
    requestUserPermission();
    getFCMToken();
    createNotificationChannel();
  }, []);

  return <Navigation />;
};

export default App;

const styles = StyleSheet.create({});
