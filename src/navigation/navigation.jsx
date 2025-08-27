import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import Logout from '../screens/Logout';
import BenefitBlogPage from '../screens/BenefitBlogPage';
import BlogDetailScreen from '../screens/BlogDetailScreen';
import ClaimedScreen from '../screens/ClaimedScreen';
import LoginScreen from '../auth/LoginScreen';
import RegisterScreen from '../auth/RegisterScreen';
import AppBottomNavigation from './BottomNavigation';

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
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
          component={AppBottomNavigation}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="BenefitBlogPage"
          component={BenefitBlogPage}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="BlogDetailScreen"
          component={BlogDetailScreen}
          screenOptions={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
