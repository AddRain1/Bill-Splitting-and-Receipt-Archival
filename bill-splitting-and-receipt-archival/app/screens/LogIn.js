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
  const [font] = useFonts({
    'SplineSansMono': require('/Users/arpitapandey/bill-splitting-and-receipt-archival-1/bill-splitting-and-receipt-archival/app/assets/fonts/SplineSansMono-Regular.ttf'), // Adjust the path accordingly
  });
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
  
    
      <TouchableOpacity style={styles.pswButton} onPress={() => console.log("Button pressed")}>
  
        <Text style = {styles.pswText}>Forgot password</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.logInButton} onPress={() => console.log("Button pressed")}>
      <Text style = {styles.logInText}>Log In</Text>

      </TouchableOpacity>

      <Text style = {styles.orText}> or </Text>


      <TouchableOpacity style={styles.accountButton} onPress={() => console.log("Button pressed")}>
        <Text style = {styles.buttonText}>Create account</Text>

      </TouchableOpacity>

      
      <StatusBar style="auto" />
    
    </SafeAreaView>
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
    top: 30,
    height: 150,
    fontSize: 48,
  },
  logInButton: {
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  accountButton: {
    height: 19,
    width: 144,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  buttonText: {
    fontFamily: 'SplineSansMono',
    color: '#00C896'
  },
  pswText: {
    fontFamily: 'SplineSansMono',
    color: '#6E7B91',
    
  },
  input: {
    backgroundColor: '#F0F4F8',
    color: '3A3A3A',
    height: 40,
    margin: 20,
    width:300,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    fontFamily: 'SplineSansMono',
  },
  pswButton: {  
    height: 40,
    margin: -10,
    marginBottom: 20,
    width:300, 

    

  },
  logInButton: {
    backgroundColor: '#00C896',
    width: 118,
    height:43,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 10,


  },
  logInText: {
    fontFamily: 'SplineSansMono',
    fontSize: 20,
    color: '#F0F4F8'
  },
  orText: {
    fontFamily: 'SplineSansMono',

  }
});