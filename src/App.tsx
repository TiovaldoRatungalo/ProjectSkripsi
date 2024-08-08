import React, {Component} from 'react';
import {View, Text} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SplashScreen from './pages/SplashScreen.js';
import SignInScreen from './pages/SignInScreen.js';
import SignUpScreen from './pages/SignUpScreen.js';
import HomeScreen from './pages/HomeScreen.js';
import ChangePassScreen from './pages/ChangePassScreen';
import ProfileScreen from './pages/ProfileScreen.js';
import ChatScreen from './pages/ChatScreen.js';
import GeolocationScreen from './pages/GeolocationScreen.js';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    //< ChatScreen />

    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
   
          <Stack.Screen
          name="GeolocationScreen"
          component={GeolocationScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignInScreen"
          component={SignInScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChangePassScreen"
          component={ChangePassScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{headerShown: false}}
        />
     
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{headerShown: false}}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
