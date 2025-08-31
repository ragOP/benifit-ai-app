import React, { useEffect, useCallback, useState } from 'react';
import { StyleSheet, Platform, Alert } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navigation from './src/navigation/navigation';

import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const queryClient = new QueryClient();

const App = () => {
  const [initializing, setInitializing] = useState(false);

  // ---- Permissions (Firebase + Notifee) ----
  const requestUserPermission = useCallback(async () => {
    // Firebase (prompts on iOS)
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (Platform.OS === 'ios') {
      // Notifee iOS permission (banner/sound/badge presentation)
      await notifee.requestPermission({
        alert: true,
        sound: true,
        badge: true,
        announcement: false,
        criticalAlert: false,
        carPlay: false,
        provisional: authStatus === messaging.AuthorizationStatus.PROVISIONAL,
      });
    }
    return enabled;
  }, []);

  // ---- Android channel; iOS categories ----
  const configureNotificationRouting = useCallback(async () => {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'benefits',
        name: 'Benefits Notifications',
        description: 'Channel for benefits and updates',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
        lights: true,
        lightColor: '#0F766E',
        badge: true,
      });
    } else {
      // Optional: action buttons/categories on iOS
      await notifee.setNotificationCategories([
        {
          id: 'benefits',
          actions: [
            { id: 'view_details', title: 'View' },
            { id: 'dismiss', title: 'Dismiss', destructive: true },
          ],
        },
      ]);
    }
  }, []);

  // ---- Display helper ----
  const displayNotification = useCallback(async (title: string, body: string, data: Record<string, string> = {}) => {
    await notifee.displayNotification({
      title,
      body,
      data,
      android: Platform.OS === 'android' ? {
        channelId: 'benefits',
        smallIcon: 'ic_launcher',   // ensure present
        largeIcon: 'ic_launcher',   // optional
        color: '#0F766E',
        sound: 'default',
        vibrationPattern: [300, 500],
        pressAction: { id: 'default' },
      } : undefined,
      ios: Platform.OS === 'ios' ? {
        categoryId: 'benefits',
        threadId: 'benefits_thread',
        sound: 'default',
      } : undefined,
    });
  }, []);

  // ---- Foreground FCM handler ----
  const onMessageReceived = useCallback(async (message) => {
    console.log('📨 FG message:', message);
    const title = message?.notification?.title ?? 'New message';
    const body  = message?.notification?.body ?? (message?.data ? JSON.stringify(message.data) : '');
    await displayNotification(title, body, message?.data || {});
  }, [displayNotification]);

  // ---- Register, get tokens (FCM + APNs) ----
  const registerAndGetTokens = useCallback(async () => {
    console.log('📲 Registering for remote messages…');
    await messaging().registerDeviceForRemoteMessages();

    const fcm = await messaging().getToken();
    console.log('🔥 FCM Token:', fcm);
    await AsyncStorage.setItem('fcmToken', fcm);

    if (Platform.OS === 'ios') {
      // Get APNs token (string) so you can test from Xcode Push panel
      const apns = await messaging().getAPNSToken();
      if (apns) {
        console.log('🍏 APNs Token (hex):', apns);
      } else {
        console.log('⚠️ APNs token not yet available (will be provided after registration).');
      }
    }
  }, []);

  // ---- Notification events (taps, actions) ----
  useEffect(() => {
    // Foreground messages
    const unsubOnMsg = messaging().onMessage(onMessageReceived);

    // App opened from background by tapping a notification
    const unsubOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('🔁 Opened from BG:', remoteMessage?.data);
    });

    // App launched from quit state by tapping a notification
    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('🚀 Opened from quit:', remoteMessage?.data);
      }
    });

    // Notifee events (actions, taps)
    const unsubNotifee = notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type === EventType.ACTION_PRESS) {
        console.log('🖱️ Action pressed:', detail.pressAction?.id, detail.notification?.data);
      }
      if (type === EventType.PRESS) {
        console.log('👆 Notification pressed:', detail.notification?.data);
      }
    });

    return () => {
      unsubOnMsg();
      unsubOpened();
      unsubNotifee();
    };
  }, [onMessageReceived]);

  // ---- Init on mount ----
  useEffect(() => {
    (async () => {
      setInitializing(true);
      const enabled = await requestUserPermission();
      if (!enabled) {
        Alert.alert('Notifications disabled', 'Enable from Settings to receive alerts.');
      }
      await configureNotificationRouting();
      await registerAndGetTokens();
      setInitializing(false);
    })();
  }, [requestUserPermission, configureNotificationRouting, registerAndGetTokens]);

  return (
    <QueryClientProvider client={queryClient}>
      <Navigation />
    </QueryClientProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
