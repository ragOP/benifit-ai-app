import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import QuestionScreen from '../screens/QuestionScreen';
import FormQuestion from '../screens/FormQuestion';
import MiddleScreen from '../screens/MiddleScreen';
import CongratsScreen from '../screens/CongratsScreen';

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Middle"
        options={{ headerShown: false }}
      >
        {/* <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Question"
          component={QuestionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Form"
          component={FormQuestion}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
          name="Middle"
          component={MiddleScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Congrats"
          component={CongratsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
