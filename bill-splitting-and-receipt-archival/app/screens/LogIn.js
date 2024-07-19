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
import styles from '../styles';


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

    <SafeAreaView style= {[styles.container, {justifyContent: 'center',}]}>
      <Image source={require('./../assets/logo.jpeg')} style ={styles.image}/>
        
     
      <Text style={styles.title}>
      <Text> 
        billy 
      </Text>
      </Text>
      <CustomInput placeholder = 'username' value = {username} setValue={setUsername} style = {styles.input}/>
      <CustomInput placeholder = 'password' value = {password} setValue={setPassword}  secureTextEntry={true} style = {styles.input}/>

      
    
      <TouchableOpacity style={[styles.pswButton, {left:-100}]} onPress={() => navigation.navigate('ForgotPassword')}>
  
        <Text style = {styles.caption}>Forgot Password</Text>
      </TouchableOpacity>


      <TouchableOpacity style={[styles.submitButton, {marginTop: 40}]} onPress={() => console.log("Button pressed")}>
      <Text style = {styles.submitText}>Log In</Text>

      </TouchableOpacity>

      <Text style = {[styles.caption, {}]}> or </Text>


      <TouchableOpacity style={styles.accountButton} onPress={() => navigation.navigate('CreateAccount')}>
        <Text style = {styles.buttonText}>Create Account</Text>

      </TouchableOpacity>

      
      <StatusBar style="auto" />
    
    </SafeAreaView>
  );
}
