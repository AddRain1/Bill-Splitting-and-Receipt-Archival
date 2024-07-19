import React, { useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity,Alert} from 'react-native';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';

function ResetPassword(props) {
    const [font] = useFonts({
        'SplineSansMono': require('/Users/irisc/OneDrive/Desktop/UCSD Java Workspace/bill-splitting-and-receipt-archival/bill-splitting-and-receipt-archival/app/assets/fonts/SplineSansMono-Regular.ttf'), 
        'PlayfairDisplay_400Regular': require('/Users/irisc/OneDrive/Desktop/UCSD Java Workspace/bill-splitting-and-receipt-archival/bill-splitting-and-receipt-archival/app/assets/fonts/PlayfairDisplay-Regular.ttf'),
        'PlayfairDisplay_700Bold': require('/Users/irisc/OneDrive/Desktop/UCSD Java Workspace/bill-splitting-and-receipt-archival/bill-splitting-and-receipt-archival/app/assets/fonts/PlayfairDisplay-Bold.ttf'),
    });
    const [text, onChangeText] =React.useState('email or username');
    const navigation = useNavigation();
    const handleReset = () => {
        
        Alert.alert(
          "Password Reset",
          "Your password has been reset. You can now log in.",
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
        <SafeAreaView style={styles.container}>
        <Text style = {styles.baseText}>
            Reset Password
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('LogIn')}>
        <Icon name="arrow-left" size={16} color="#00C896" style={styles.icon} />
        <Text style = {styles.buttonText}> back to login</Text>
        </TouchableOpacity>

        <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder = "confirmation code"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder="new password"
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder="confirm password"
        secureTextEntry={true}
      />
       <TouchableOpacity style={styles.submitButton} onPress={handleReset} >
        <Text style = {styles.submitText}> Submit </Text>
        

      </TouchableOpacity> 
 

            




        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container:{
        backgroundColor: '#fff',
        flex: 1
    
    },
    baseText: {
        fontSize: 32,
        width: 275,
        height: 45,
        top: 250,
        left: 50,
        fontFamily: 'PlayfairDisplay_700Bold',
    },
    backButton:{
        width:154,
        height: 22,
        top: 260,
        left:55,
        flexDirection: 'row' 
    },
    buttonText:{
        fontFamily:'SplineSansMono',
        fontSize: 16, 
        color: '#00C896'
    },
    input: {
        top:300,
        left:35,
        fontFamily: 'SplineSansMono',
        backgroundColor: '#F0F4F8',
        color: '3A3A3A',
        height: 40,
        width: 330,
        margin:20,
        borderWidth: 1,
        padding: 10,
        borderRadius: 4
     
      },
    submitText:{
        fontSize: 20,
        fontFamily:'SplineSansMono',
        color: '#F0F4F8',

    },
    submitButton: {
        top:350,
        left: 156,
        alignItems: 'center',
        justifyContent: 'center',
        width: 118,
        backgroundColor: '#00C896',
        height:43,
        borderRadius:12
    },
    
   

})

export default ResetPassword;