import React, { useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert} from 'react-native';
import { useFonts } from 'expo-font';
/*import {
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
} from '@expo-google-fonts/playfair-display'; */
import Icon from 'react-native-vector-icons/FontAwesome';
import  { useNavigation } from '@react-navigation/native';
import styles from '../styles';


function ForgotPassword(props) {
    const [font] = useFonts({
        'SplineSansMono': require('./../assets/fonts/SplineSansMono-Regular.ttf'), 
        'PlayfairDisplay_400Regular': require('./../assets/fonts/PlayfairDisplay-Regular.ttf'),
        'PlayfairDisplay_700Bold': require('./../assets/fonts/PlayfairDisplay-Bold.ttf'),
    });

  
    

    const [text, setText] = useState('');
    const [showText, setShowText] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const handleTextChange = (input) => {
        setText(input);
        if (input) {
          setIsPopupVisible(true);
        } else {
          setIsPopupVisible(false);
        }
      };
    const navigation = useNavigation();
    const handleForgotPsw = () => {
      Alert.alert(
        "Email Sent",
        "Please check your email for a confirmation code to reset your password.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate('ResetPassword')
          }
        ]
      );
    };
    
    
    return (
       <SafeAreaView>
        <Text style = {[styles.heading1, {position: 'absolute', width: 275, height: 56, top: 300, left: 50,}]}>
            Forgot Password
        </Text>
        <TouchableOpacity style={[styles.backButton, {position: 'absolute', width:154, height: 25, top: 355, left:55,}]} onPress={() => console.log("Button pressed")}>
        <Icon name="arrow-left" size={16} color="#00C896" style={styles.icon} />
        <Text style = {styles.buttonText}> back to login</Text>
        </TouchableOpacity>
        <TextInput
        onChangeText={handleTextChange}
        style={[styles.input, {position: 'absolute',top:420, left: 50,}]}
        placeholder = "username or email"
      />
      {showText && isPopupVisible && <Text style = {styles.pressedText}>please check your inbox for instructions on resetting your password</Text>}
        <TouchableOpacity style={[styles.submitButton, {top:500, left: 156,}]} onPress={handleForgotPsw}>
        <Text style = {styles.submitText}> Submit </Text>
        

      </TouchableOpacity> 
      



       </SafeAreaView>
    );
}

export default ForgotPassword;