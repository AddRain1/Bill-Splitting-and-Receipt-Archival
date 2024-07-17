import React, { useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Image, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity} from 'react-native';
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
import CustomInput from '../assets/CustomInput';
import { useNavigation } from '@react-navigation/native';
// import styles from '../styles';


export default function HomePage() {
  const [font] = useFonts({
    'SplineSansMono': require('./../assets/fonts/SplineSansMono-Regular.ttf'), // Adjust the path accordingly
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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

  return (

    <SafeAreaView style= {styles.container}>
      <Image source={require('./../assets/logo.jpeg')} style ={styles.image}/>
        
     
      <Text style={styles.baseText}>
      <Text> 
        billy 
      </Text>
      </Text>
      <CustomInput placeholder = 'username' value = {username} setValue={setUsername} style = {styles.input}/>
      <CustomInput placeholder = 'password' value = {password} setValue={setPassword}  secureTextEntry={true} style = {styles.input}/>

      
    
      <TouchableOpacity style={styles.pswButton} onPress={() => navigation.navigate('ForgotPassword')}>
  
        <Text style = {styles.pswText}>Forgot Password</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.logInButton} onPress={() => console.log("Button pressed")}>
      <Text style = {styles.logInText}>Log In</Text>

      </TouchableOpacity>

      <Text style = {styles.orText}> or </Text>


      <TouchableOpacity style={styles.accountButton} onPress={() => navigation.navigate('CreateAccount')}>
        <Text style = {styles.buttonText}>Create Account</Text>

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
  image: {
    width: 124,
    height: 124,
    // Add other styling properties as needed
  },
  baseText: {
    fontFamily: 'PlayfairDisplay_700Bold_Italic',
    top: 10,
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
    margin: 10,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  buttonText: {
    fontFamily: 'SplineSansMono',
    fontSize: 16,
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
    margin: -5,
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