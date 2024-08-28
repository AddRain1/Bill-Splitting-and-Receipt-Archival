import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import styles from ".././styles";

const CustomInput = ({ value, setValue, placeholder, secureTextEntry,style, onSubmitEditing}) => {
	return (
		<View>
			<TextInput
				value={value}
				onChangeText={setValue}
				placeholder={placeholder}
				style={[styles.input,style]} // Merge default styles with passed-in styles
				secureTextEntry={secureTextEntry}
				onSubmitEditing={onSubmitEditing} // Add this line to handle return key press
			/>
		</View>
	);
};

export default CustomInput;
