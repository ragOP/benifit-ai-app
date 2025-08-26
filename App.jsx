import { StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import Navigation from './src/navigation/navigation';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  useEffect(() => {
    const registerAndGetToken = async () => {
      console.log('App mounted');
      await messaging().registerDeviceForRemoteMessages();

      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.info('Authorization status:', authStatus);
        try {
          const token = await messaging().getToken();
          console.log('Token:', token);
          await AsyncStorage.setItem('fcmToken', token);
        } catch (error) {
          console.error('Error getting token:', error);
        }
      } else {
        console.log('Notification permission not granted');
      }
    };

    registerAndGetToken();
  }, []);

  return <Navigation />;
};

export default App;

const styles = StyleSheet.create({});
