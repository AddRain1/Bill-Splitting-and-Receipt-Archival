import {
<<<<<<< HEAD
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
import AppLoading from 'expo-app-loading';


=======
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
import AppLoading from "expo-app-loading";
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
import styles from "../styles";
>>>>>>> 771c83881dad5de062af4345ed72833f516bd215

function CreateAccount(props) {
	const [font] = useFonts({
		SplineSansMono: require("./../assets/fonts/SplineSansMono-Regular.ttf"), // Adjust the path accordingly
	});
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [password, setPassword] = useState("");
	const [retypePassword, setRetypePassword] = useState("");
	const navigation = useNavigation();

	const handleSignUp = () => {
		Alert.alert(
			"Account Created",
			"Your account has been created. You can now log in.",
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
		<SafeAreaView style={styles.container}>
			<Text style={[styles.heading1, { height: 56, top: 100, right: 50 }]}>
				Create account
			</Text>
			<TouchableOpacity
				style={[styles.backButton, { height: 40, top: 110, right: 90 }]}
				onPress={() => navigation.navigate("LogIn")}
			>
				<Icon name="arrow-left" size={20} color="#00C896" style={styles.icon} />
				<Text style={styles.buttonText}> back to login</Text>
			</TouchableOpacity>
			<CustomInput placeholder="email" value={email} setValue={setEmail} />
			<CustomInput
				placeholder="first name"
				value={firstName}
				setValue={setFirstName}
			/>
			<CustomInput
				placeholder="last name"
				value={lastName}
				setValue={setLastName}
			/>
			<CustomInput
				placeholder="username"
				value={username}
				setValue={setUsername}
				style={[styles.input, { top: 130 }]}
			/>
			<CustomInput
				placeholder="password"
				value={password}
				setValue={setPassword}
				secureTextEntry={true}
			/>
			<CustomInput
				placeholder="retype password"
				value={retypePassword}
				setValue={setRetypePassword}
				secureTextEntry={true}
			/>

			<TouchableOpacity
				style={[styles.submitButton, { top: 50 }]}
				onPress={handleSignUp}
			>
				<Text style={styles.submitText}> Sign Up </Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

export default CreateAccount;
