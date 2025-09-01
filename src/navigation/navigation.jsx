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
import MyProfileScreen from '../screens/MyProfileScreen';
import ReferralScreen from '../screens/ReferralScreen';
import LoaderScreen from '../screens/LoadingPage';
import CongratsScreen from '../screens/CongratsScreen';
import AfterQuizScreen from '../screens/AfterQuizScreen';
import MiddleScreen from '../screens/MiddleScreen';

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
        <Stack.Screen
          name="MyProfileScreen"
          component={MyProfileScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReferralScreen"
          component={ReferralScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="ClaimedScreen"
          component={ClaimedScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoadingPage"
          component={LoaderScreen}
          screenOptions={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name="Middle"
          component={MiddleScreen}
          screenOptions={{ headerShown: false }}
        /> */}
        {/* <Stack.Screen
          name="AfterQuizScreen"
          component={AfterQuizScreen}
          screenOptions={{ headerShown: false }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
