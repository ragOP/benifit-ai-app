import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import Navigation from './src/navigation/navigation';
import messaging from '@react-native-firebase/messaging';

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

  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('Token:', token);
    } catch (error) {
      console.error('Error getting token:', error);
    }
  }

  useEffect(() => {
    console.log('App mounted');
    requestUserPermission();
    getToken();
  }, []);

  return <Navigation />;
};

export default App;

const styles = StyleSheet.create({});
