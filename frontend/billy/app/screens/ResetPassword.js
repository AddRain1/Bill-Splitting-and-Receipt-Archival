import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
	Alert,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../styles";

function ResetPassword(props) {
	const [font] = useFonts({
		SplineSansMono: require("./../assets/fonts/SplineSansMono-Regular.ttf"),
		PlayfairDisplay_400Regular: require("./../assets/fonts/PlayfairDisplay-Regular.ttf"),
		PlayfairDisplay_700Bold: require("./../assets/fonts/PlayfairDisplay-Bold.ttf"),
	});
	const [text, onChangeText] = React.useState("email or username");
	const navigation = useNavigation();
	const handleReset = () => {
		Alert.alert(
			"Password Reset",
			"Your password has been reset. You can now log in.",
			[
				{
					text: "OK",
					onPress: () => navigation.navigate("LogIn"),
				},
			],
		);
	};
	if (!font) {
		return <AppLoading />;
	}

	return (
		<SafeAreaView>
			<Text
				style={[
					styles.heading1,
					{ position: "absolute", width: 275, height: 45, top: 250, left: 50 },
				]}
			>
				Reset Password
			</Text>
			<TouchableOpacity
				style={[
					styles.backButton,
					{ width: 154, height: 22, top: 260, left: 55 },
				]}
				onPress={() => navigation.navigate("LogIn")}
			>
				<Icon name="arrow-left" size={16} color="#00C896" style={styles.icon} />
				<Text style={styles.buttonText}> back to login</Text>
			</TouchableOpacity>

			<TextInput
				style={[styles.input, { top: 180, left: 35 }]}
				onChangeText={onChangeText}
				placeholder="confirmation code"
			/>
			<TextInput
				style={[styles.input, { top: 180, left: 35 }]}
				onChangeText={onChangeText}
				placeholder="new password"
				secureTextEntry={true}
			/>
			<TextInput
				style={[styles.input, { top: 180, left: 35 }]}
				onChangeText={onChangeText}
				placeholder="confirm password"
				secureTextEntry={true}
			/>
			<TouchableOpacity
				style={[styles.submitButton, { top: 220, left: 156 }]}
				onPress={handleReset}
			>
				<Text style={styles.submitText}> Submit </Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

export default ResetPassword;
