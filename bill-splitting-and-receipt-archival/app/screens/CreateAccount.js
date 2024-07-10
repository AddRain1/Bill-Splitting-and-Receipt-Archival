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
import Icon from 'react-native-vector-icons/FontAwesome';



function CreateAccount(props) {
    const [font] = useFonts({
        'SplineSansMono': require('/Users/arpitapandey/bill-splitting-and-receipt-archival-1/bill-splitting-and-receipt-archival/app/assets/fonts/SplineSansMono-Regular.ttf'), // Adjust the path accordingly
    });

    const [text, onChangeText] =React.useState('email or username');
    
    return (
        <SafeAreaView style = {styles.container}>
         <Text style ={styles.baseText}>
            Create account
         </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => console.log("Button pressed")}>
        <Icon name="arrow-left" size={20} color="#00C896" style={styles.icon} />
        <Text style = {styles.buttonText}> back to login</Text>

       </TouchableOpacity>

       <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder = "email"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder="username"
      />
       <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder = "first name"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder="last name"
      />
       <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder = "password"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder="confirm password"
      />

      <TouchableOpacity style={styles.signUpButton} onPress={() => console.log("Button pressed")}>
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
        top:160,
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