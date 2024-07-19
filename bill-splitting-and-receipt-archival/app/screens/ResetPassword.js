import React, { useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity,Alert} from 'react-native';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles';
import AppLoading from 'expo-app-loading';

function ResetPassword(props) {
    const [font] = useFonts({
        'SplineSansMono': require('./../assets/fonts/SplineSansMono-Regular.ttf'), 
        'PlayfairDisplay_400Regular': require('./../assets/fonts/PlayfairDisplay-Regular.ttf'),
        'PlayfairDisplay_700Bold': require('./../assets/fonts/PlayfairDisplay-Bold.ttf'),
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


export default ResetPassword;