// import messaging from '@react-native-firebase/messaging';
// import { Alert } from 'react-native';
// import NotificationPermissions from '../utils/NotificationPermissions';

// // Constants
// const FCM_TOKEN_KEY = 'fcm_token';
// const NOTIFICATION_SETTINGS_KEY = 'notification_settings';

// /**
//  * Initialize notification service
//  */
// export const initializeNotificationService = async () => {
//   try {
//     console.log('Initializing notification service...');

//     // Request notification permission
//     const hasPermission =
//       await NotificationPermissions.requestPermissionWithFallback();

//     if (hasPermission) {
//       // Initialize Firebase messaging
//       await initializeFirebaseMessaging();
//       console.log('✅ Notification service initialized successfully');
//       return true;
//     } else {
//       console.log('❌ Notification permission denied');
//       return false;
//     }
//   } catch (error) {
//     console.error('❌ Error initializing notification service:', error);
//     return false;
//   }
// };

// /**
//  * Initialize Firebase Cloud Messaging
//  */
// export const initializeFirebaseMessaging = async () => {
//   try {
//     // Get FCM token
//     const token = await getFCMToken();

//     // Set up background message handler
//     setupBackgroundMessageHandler();

//     console.log('🔥 Firebase messaging initialized with token:', token);
//   } catch (error) {
//     console.error('❌ Error initializing Firebase messaging:', error);
//   }
// };

// /**
//  * Get FCM token for the device
//  */
// export const getFCMToken = async () => {
//   try {
//     const token = await messaging().getToken();

//     if (token) {
//       console.log('📱 FCM Token obtained:', token);
//       return token;
//     }

//     console.log('❌ Failed to get FCM token');
//     return null;
//   } catch (error) {
//     console.error('❌ Error getting FCM token:', error);
//     return null;
//   }
// };

// /**
//  * Set up background message handler
//  */
// export const setupBackgroundMessageHandler = () => {
//   messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('📱 Background message received:', remoteMessage);

//     // Handle background message
//     await handleBackgroundMessage(remoteMessage);
//   });
// };

// /**
//  * Handle background messages
//  */
// export const handleBackgroundMessage = async remoteMessage => {
//   try {
//     // You can perform background tasks here
//     console.log('🔄 Processing background message:', remoteMessage.data);

//     // Store notification data if needed
//     await storeNotificationData(remoteMessage);
//   } catch (error) {
//     console.error('❌ Error handling background message:', error);
//   }
// };

// /**
//  * Store notification data locally
//  */
// export const storeNotificationData = async remoteMessage => {
//   try {
//     // For now, just log the data
//     // Later you can implement AsyncStorage to save notifications
//     console.log('💾 Storing notification data:', {
//       title: remoteMessage.notification?.title,
//       body: remoteMessage.notification?.body,
//       data: remoteMessage.data,
//       timestamp: new Date().toISOString(),
//     });
//   } catch (error) {
//     console.error('❌ Error storing notification data:', error);
//   }
// };

// /**
//  * Check if notifications are enabled
//  */
// export const areNotificationsEnabled = async () => {
//   return await NotificationPermissions.checkNotificationPermission();
// };

// /**
//  * Get detailed permission status
//  */
// export const getPermissionStatus = async () => {
//   return await NotificationPermissions.getPermissionStatus();
// };

// /**
//  * Request notification permission explicitly
//  */
// export const requestPermission = async () => {
//   return await NotificationPermissions.requestNotificationPermission();
// };

// /**
//  * Test notification permission
//  */
// export const testNotificationPermission = async () => {
//   try {
//     const status = await getPermissionStatus();
//     console.log('📱 Notification Permission Status:', status);

//     if (status.granted) {
//       console.log('✅ Notifications are enabled');
//       return true;
//     } else {
//       console.log('❌ Notifications are disabled');
//       console.log('📋 Status:', status.status);
//       return false;
//     }
//   } catch (error) {
//     console.error('❌ Error testing notification permission:', error);
//     return false;
//   }
// };

// /**
//  * Show a test notification
//  */
// export const showTestNotification = async () => {
//   try {
//     const hasPermission = await areNotificationsEnabled();

//     if (!hasPermission) {
//       console.log('❌ Cannot show notification: permission not granted');
//       return false;
//     }

//     // For now, we'll just log the notification
//     // Later you can integrate with actual notification libraries
//     console.log('🔔 Test Notification Sent!');
//     console.log('📱 Title: Benefits Update');
//     console.log('📝 Body: You have new benefits available!');

//     return true;
//   } catch (error) {
//     console.error('❌ Error showing test notification:', error);
//     return false;
//   }
// };

// /**
//  * Get FCM token from storage
//  */
// export const getStoredFCMToken = async () => {
//   try {
//     // You can implement AsyncStorage here later
//     console.log('📱 Getting stored FCM token');
//     return null;
//   } catch (error) {
//     console.error('❌ Error getting stored FCM token:', error);
//     return null;
//   }
// };

// /**
//  * Delete FCM token
//  */
// export const deleteFCMToken = async () => {
//   try {
//     // You can implement AsyncStorage removal here later
//     console.log('🗑️ FCM token deleted');
//     return true;
//   } catch (error) {
//     console.error('❌ Error deleting FCM token:', error);
//     return false;
//   }
// };

// // Default export with all functions
// const NotificationService = {
//   initialize: initializeNotificationService,
//   initializeFirebaseMessaging,
//   getFCMToken,
//   setupBackgroundMessageHandler,
//   handleBackgroundMessage,
//   storeNotificationData,
//   areNotificationsEnabled,
//   getPermissionStatus,
//   requestPermission,
//   testNotificationPermission,
//   showTestNotification,
//   getStoredFCMToken,
//   deleteFCMToken,
// };

// export default NotificationService;
