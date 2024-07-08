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


export default function HomePage() {
    let [fontsLoaded] = useFonts({
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
    });

  const [text, onChangeText] =React.useState('email or username');


  return (
    <NavigationContainer>
    <SafeAreaView style= {styles.container}>
      <Text style={styles.baseText}>
      <Text> 
        billy 
      </Text>
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder = "username"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder="password"
      />
  
      
      <TouchableOpacity style={styles.logInButton} onPress={() => console.log("Button pressed")}>
        <Text style = {styles.buttonText}>Create account</Text>

      </TouchableOpacity>
      <TouchableOpacity style={styles.pswButton} onPress={() => console.log("Button pressed")}>
  
        <Text style = {styles.pswText}>Forgot password</Text>
      </TouchableOpacity>

      
      <StatusBar style="auto" />
    
    </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontFamily: 'PlayfairDisplay_700Bold_Italic',
    height: 240,
    fontSize: 48,
  },
  logInButton: {
    height: 30,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logInButton: {
    height: 19,
    width: 144,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  buttonText: {
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#00C896'
  },
  pswText: {
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#6E7B91'
  },
  input: {
    backgroundColor: '#F0F4F8',
    color: '3A3A3A',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});