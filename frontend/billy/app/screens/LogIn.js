import {
	PlayfairDisplay_400Regular,
	PlayfairDisplay_400Regular_Italic,
	PlayfairDisplay_500Medium,
	PlayfairDisplay_500Medium_Italic,
	PlayfairDisplay_600SemiBold,
	PlayfairDisplay_600SemiBold_Italic,
	PlayfairDisplay_700Bold,
	PlayfairDisplay_700Bold_Italic,
	PlayfairDisplay_800ExtraBold,
	PlayfairDisplay_800ExtraBold_Italic,
	PlayfairDisplay_900Black,
	PlayfairDisplay_900Black_Italic,
	useFonts,
} from "@expo-google-fonts/playfair-display";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import AppLoading from "expo-app-loading";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import axios from 'axios';
import {
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Linking,
	Button
} from "react-native";
import CustomInput from "../assets/CustomInput";
import styles from "../styles";
import HomeStackNavigator from "../assets/HomeStackNavigator";

 function LogIn(props) {
	const [font] = useFonts({
		SplineSansMono: require("./../assets/fonts/SplineSansMono-Regular.ttf"), // Adjust the path accordingly
	});
	const [fontsLoaded] = useFonts({
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
	});
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const navigation = useNavigation();
	if (!font) {
		return <AppLoading />;
	}
	const handleGoogleLogin = () => {
		const googleAuthUrl = 'http://localhost:3000/auth/google';
		Linking.openURL(googleAuthUrl);
	  };

	  const handleLogin = async () => {
		try {
			const response = await axios.post('http://localhost:3000/login', {
				username,
				password,
			}, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
			// Handle the response here (e.g., navigate to another screen or show a message)
			console.log('Login successful:', response.data);
		} catch (error) {
			console.error('Error:', error.response ? error.response.data : error.message);
		}
	}

	return (
		<SafeAreaView style={[styles.container, { justifyContent: "center" }]}>
			<Image source={require("./../assets/logo.jpeg")} style={styles.image} />

			<Text style={styles.title}>
				<Text>billy</Text>
			</Text>
			<CustomInput
				placeholder="username"
				value={username}
				setValue={setUsername}
				style={styles.input}
			/>
			<CustomInput
				placeholder="password"
				value={password}
				setValue={setPassword}
				secureTextEntry={true}
				style={styles.input}
			/>

			<TouchableOpacity
				style={[styles.pswButton, { left: -100 }]}
				onPress={() => navigation.navigate("ForgotPassword")}
			>
				<Text style={styles.caption}>Forgot Password</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.submitButton, { marginTop: 40 }]}
				onPress={() => handleLogin()}
			>
				<Text style={styles.submitText}>Log In</Text>
			</TouchableOpacity>

			<Text style={[styles.caption, {}]}> or </Text>

			<TouchableOpacity
				style={styles.accountButton}
				onPress={() => navigation.navigate("CreateAccount")}
			>
				<Text style={styles.buttonText}>Create Account</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.googleButton, { marginTop: 40 }]}
				onPress={() => handleLogin()}
			>
				<Text style={styles.submitText}>Log In With Google</Text>
			</TouchableOpacity>



			<StatusBar style="auto" />
		</SafeAreaView>
	);
}
export default LogIn;