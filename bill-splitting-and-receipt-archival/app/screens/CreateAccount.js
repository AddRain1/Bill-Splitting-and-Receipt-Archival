import React, { useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity,Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomInput from '../assets/CustomInput';
import { useNavigation } from '@react-navigation/native';
// import styles from '../styles.js';
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
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomInput from '../assets/CustomInput';
import { useNavigation } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';



function CreateAccount(props) {
    const [font] = useFonts({
        'SplineSansMono': require('/Users/irisc/OneDrive/Desktop/UCSD Java Workspace/bill-splitting-and-receipt-archival/bill-splitting-and-receipt-archival/app/assets/fonts/SplineSansMono-Regular.ttf'), // Adjust the path accordingly
    });
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const navigation = useNavigation();
   
    const handleSignUp = () => {
        
        Alert.alert(
          "Account Created",
          "Your account has been created. You can now log in.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate('LogIn')
            }
          ]
        );
      };
      if (!font) {
        return <AppLoading />;
      }
    
    
    return (
        <SafeAreaView style = {styles.container}>
         <Text style ={styles.baseText}>
            Create account
         </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('LogIn')}>
        <Icon name="arrow-left" size={20} color="#00C896" style={styles.icon} />
        <Text style = {styles.buttonText}> back to login</Text>

       </TouchableOpacity>
       <CustomInput placeholder = 'email' value= {email} setValue={setEmail}/>
       <CustomInput placeholder = 'first name' value = {firstName} setValue={setFirstName} />
       <CustomInput placeholder = 'last name' value = {lastName} setValue={setLastName} />
        <CustomInput placeholder = 'username' value = {username} setValue={setUsername} style = {styles.input}/>
      <CustomInput placeholder = 'password' value = {password} setValue={setPassword}  secureTextEntry={true}/>
      <CustomInput placeholder = 'retype password' value = {retypePassword} setValue={setRetypePassword}  secureTextEntry={true} />
       

      <TouchableOpacity style={[styles.signUpButton, {height:43, width: 118,}]} onPress={handleSignUp}>
        <Text style = {styles.signUpText}> Sign Up </Text>

      </TouchableOpacity> 
  
    





        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      
    },
  baseText: {
      fontFamily: 'PlayfairDisplay_700Bold',
      height: 56,
      top: 100,
      right: 50,
      fontSize: 32,
      
  },
  backButton: {
      flexDirection: 'row',
      height: 40,
      top: 110,
      right:90,
      marginBottom: 100,
  },
  buttonText: {
      fontFamily: 'SplineSansMono',
      color: '#00C896',
    },
  input: {
      top:130,
      backgroundColor: '#F0F4F8',
      color: '3A3A3A',
      height: 40,
      width: 330,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      borderRadius: 4
   
    },
  signUpButton: {
      top:50,
      alignItems: 'center',
      justifyContent: 'center',
      width: 118,
      backgroundColor: '#00C896',
      height:43,
      borderRadius:12
  },
  signUpText: {
      fontSize: 18,
      fontFamily:'SplineSansMono',
      color: '#F0F4F8',

      
  }
  
})

export default CreateAccount;