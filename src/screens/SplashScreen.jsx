import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log('Token from AsyncStorage:', token);

        setTimeout(() => {
          if (token) {
            navigation.replace('BottomNavigation');
          } else {
            navigation.replace('Register');
          }
        }, 2000);
      } catch (error) {
        console.error('Error checking token:', error);
        navigation.replace('Register');
      }
    };

    checkLoginStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/center.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#18181b',
  },
  logo: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
