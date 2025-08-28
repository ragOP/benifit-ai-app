import React, { useEffect, useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import Navigation from './src/navigation/navigation';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

const App = () => {
  // Authentication state
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Handle user state changes
  const handleAuthStateChanged = useCallback((user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  }, [initializing]);

  // Initialize Google Sign-In
  // useEffect(() => {
  //   GoogleSignin.configure({
  //     webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // Get this from Firebase Console
  //   });
  // }, []);

  // Listen for auth state changes
  // useEffect(() => {
  //   const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
  //   return subscriber;
  // }, [handleAuthStateChanged]);

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
        console.log(':white_check_mark: Firebase permission already granted');
      } else {
        const granted = await requestUserPermission();

        if (granted) {
          console.log(
            ':white_check_mark: Firebase permission granted successfully',
          );
        } else {
          console.warn(':no_entry_sign: Firebase permission denied');
        }
      }
    } catch (error) {
      console.error(':x: Error handling permissions:', error);
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
  const onMessageReceived = useCallback(async message => {
    console.log(':iphone: Message received:', message);

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
          largeIcon: 'ic_launcher',
          color: '#0F766E',
          sound: 'default',
          vibrationPattern: [300, 500],
          // priority: notifee.AndroidImportance.HIGH,
          // actions: [
          //   {
          //     title: 'View Details',
          //     pressAction: {
          //       id: 'view_details',
          //     },
          //   },
          //   {
          //     title: 'Dismiss',
          //     pressAction: {
          //       id: 'dismiss',
          //     },
          //   },
          // ],
        },
        ios: {
          categoryId: 'benefits',
          threadId: 'benefits_thread',
        },
      });

      console.log(':white_check_mark: Notification displayed successfully');
    } catch (error) {
      console.error(':x: Error displaying notification:', error);
    }
  }, []);
  const registerAndGetToken = async () => {
    try {
      console.log(':calling: Registering for remote messages...');
      await messaging().registerDeviceForRemoteMessages();

      const token = await messaging().getToken();
      console.log(':envelope_with_arrow: FCM Token:', token);
      await AsyncStorage.setItem('fcmToken', token);
    } catch (error) {
      console.error(':x: Error getting FCM token:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(onMessageReceived);
    return unsubscribe;
  }, [onMessageReceived]);

  // Background message handler
  // useEffect(() => {
  //   messaging().setBackgroundMessageHandler(onMessageReceived);
  // }, [onMessageReceived]);

  // Initialize everything on mount
  useEffect(() => {
    console.log(':rocket: App mounted');
    handlePermissions();
    createNotificationChannel();
    registerAndGetToken();
  }, []);

  // if (initializing) return null;

  return <Navigation />;
};

export default App;

const styles = StyleSheet.create({});
