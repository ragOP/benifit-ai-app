import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import BenefitBlogPage from '../screens/BenefitBlogPage';
import LoginScreen from '../auth/LoginScreen';
import RegisterScreen from '../auth/RegisterScreen';
import BottomNavigation from './BottomNavigation';

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="BottomNavigation"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="BottomNavigation"
          component={BottomNavigation}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="BenefitBlogPage"
          component={BenefitBlogPage}
          screenOptions={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
