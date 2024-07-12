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


function ForgotPassword(props) {
    const [font] = useFonts({
        'SplineSansMono': require('/Users/arpitapandey/bill-splitting-and-receipt-archival-1/bill-splitting-and-receipt-archival/app/assets/fonts/SplineSansMono-Regular.ttf'), 
        'PlayfairDisplay_400Regular': require('/Users/arpitapandey/bill-splitting-and-receipt-archival-1/bill-splitting-and-receipt-archival/app/assets/fonts/PlayfairDisplay-Regular.ttf'),
        'PlayfairDisplay_700Bold': require('/Users/arpitapandey/bill-splitting-and-receipt-archival-1/bill-splitting-and-receipt-archival/app/assets/fonts/PlayfairDisplay-Bold.ttf'),
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
        <Text style = {styles.baseText}>
            Forgot Password
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => console.log("Button pressed")}>
        <Icon name="arrow-left" size={16} color="#00C896" style={styles.icon} />
        <Text style = {styles.buttonText}> back to login</Text>
        </TouchableOpacity>
        <TextInput
        onChangeText={handleTextChange}
        style={styles.input}
        placeholder = "username or email"
      />
      {showText && isPopupVisible && <Text style = {styles.pressedText}>please check your inbox for instructions on resetting your password</Text>}
        <TouchableOpacity style={styles.submitButton} onPress={handleForgotPsw}>
        <Text style = {styles.submitText}> Submit </Text>
        

      </TouchableOpacity> 
      



       </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    baseText: {
        fontSize: 32,
        width: 275,
        height: 56,
        top: 300,
        left: 50,
        fontFamily: 'PlayfairDisplay_700Bold',
    },
    backButton:{
        width:154,
        height: 25,
        top: 310,
        left:55,
        flexDirection: 'row'
    },
    buttonText:{
        fontFamily:'SplineSansMono',
        fontSize: 16, 
        color: '#00C896'
    },
    input: {
        top:370,
        left: 50,
        backgroundColor: '#F0F4F8',
        color: '3A3A3A',
        height: 40,
        width: 330,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 4,
        gap: 28,
        fontFamily: 'SplineSansMono',
     
      },
    submitButton: {
        top:450,
        left: 156,
        alignItems: 'center',
        justifyContent: 'center',
        width: 118,
        backgroundColor: '#00C896',
        height:43,
        borderRadius:12
    },
    submitText:{
        fontSize: 20,
        fontFamily:'SplineSansMono',
        color: '#F0F4F8',

    },
    pressedText:{
        fontFamily: 'SplineSansMono',
        color: '#00C896',
        width:330,
        height: 60,
        left: 60,
        top: 400,
        marginTop: -40,
        fontSize: 14

    }
    



    
})

export default ForgotPassword;