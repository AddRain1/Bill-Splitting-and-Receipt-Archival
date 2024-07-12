import React from 'react';
import {View,Text, TextInput, StyleSheet} from 'react-native';


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


const styles = StyleSheet.create({
    input: {
        backgroundColor: '#F0F4F8',
        color: '3A3A3A',
        height: 40,
        margin: 10,
        width:300,
        borderWidth: 1,
        padding: 10,
        borderRadius: 4,
        fontFamily: 'SplineSansMono',
      },

    
})

export default CustomInput;