import React, { useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity} from 'react-native';
import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_800ExtraBold,
  PlayfairDisplay_900Black,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_500Medium_Italic,
  PlayfairDisplay_600SemiBold_Italic,
  PlayfairDisplay_700Bold_Italic,
  PlayfairDisplay_800ExtraBold_Italic,
  PlayfairDisplay_900Black_Italic,
} from '@expo-google-fonts/playfair-display';
import LogIn from './app/screens/LogIn';
import CreateAccount from './app/screens/CreateAccount';
import ForgotPassword from './app/screens/ForgotPassword';
import ResetPassword from './app/screens/ResetPassword';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();


export default function App() {
   
  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown: false}}>
 
      <Stack.Screen name ="LogIn" component={LogIn} />
      <Stack.Screen name ="CreateAccount" component={CreateAccount} />
      <Stack.Screen name ="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name ="ResetPassword" component={ResetPassword} />
      



    </Stack.Navigator>



    </NavigationContainer>
   
  );
}


