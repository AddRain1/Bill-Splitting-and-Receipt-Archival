import React from 'react';
import {View,Text, TextInput, StyleSheet} from 'react-native';
import styles from '.././styles';


const CustomInput = ({value, setValue, placeholder,secureTextEntry}) =>{

    return (
       <View>
        <TextInput 
        value = {value}
        onChangeText={setValue}
        placeholder= {placeholder}
        style= {styles.input}
        secureTextEntry={secureTextEntry}
        />

       </View>

    );
}

export default CustomInput;