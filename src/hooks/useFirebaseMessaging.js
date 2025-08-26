import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

/**
 * Custom hook for handling Firebase Cloud Messaging
 * Use this in your React components to handle foreground messages
 */
export const useFirebaseMessaging = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('📱 Foreground message received:', remoteMessage);
      
      // Show alert for foreground messages
      Alert.alert(
        remoteMessage.notification?.title || 'New Notification',
        remoteMessage.notification?.body || 'You have a new message',
        [
          {
            text: 'View',
            onPress: () => {
              // Handle notification tap
              console.log('📱 Notification tapped:', remoteMessage.data);
              // You can navigate to specific screen based on data
              // navigation.navigate('NotificationDetails', { data: remoteMessage.data });
            },
          },
          {
            text: 'Dismiss',
            style: 'cancel',
          },
        ]
      );
    });

    return unsubscribe;
  }, []);

  return null;
};

export default useFirebaseMessaging; 