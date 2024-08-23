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
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
	Alert,
	SafeAreaView,
	ScrollView,
	Switch,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import CustomInput from "../assets/CustomInput";
import NavigationBar from "../assets/NavigationBar";
import WelcomeBar from "../assets/WelcomeBar";
import COLORS from "../assets/colors";
import styles from "../styles";

function Settings(props) {
	const [font] = useFonts({
		SplineSansMono: require("./../assets/fonts/SplineSansMono-Regular.ttf"),
	});
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [password, setPassword] = useState("");
	const [retypePassword, setRetypePassword] = useState("");
	const navigation = useNavigation();

	const [isBillEnabled, setIsBillEnabled] = useState(false);
	const [isUnpaidEnabled, setIsUnpaidEnabled] = useState(false);
	const [isSummaryEnabled, setIsSummaryEnabled] = useState(false);

	const toggleBillSwitch = () =>
		setIsBillEnabled((previousState) => !previousState);
	const toggleUnpaidSwitch = () =>
		setIsUnpaidEnabled((previousState) => !previousState);
	const toggleSummarySwitch = () =>
		setIsSummaryEnabled((previousState) => !previousState);

	const handleUpdate = () => {
		Alert.alert("Profile Updated", "Your profile has been updated.", [
			{
				text: "OK",
				onPress: () => navigation.navigate("Settings"),
			},
		]);
	};

	const handleConfirmation = () => {
		Alert.alert(
			"Confirmation",
			"Please confirm that you would like to delete your account.",
			[
				{
					text: "Confirm",
					onPress: () => navigation.navigate("LogIn"),
				},
				{
					text: "Cancel",
					onPress: () => navigation.navigate("Settings"),
				},
			],
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<WelcomeBar />
			<ScrollView
				contentContainerStyle={styles.scroll}
				showsVerticalScrollIndicator={false}
			>
				<SafeAreaView style={styles.container2}>
					<Text style={[styles.heading1, {}]}>Notifications</Text>
				</SafeAreaView>
				<SafeAreaView
					style={[
						styles.input,
						{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							margin: 8,
						},
					]}
				>
					<Text style={styles.body1}> New bill notification </Text>
					<View style={{ marginRight: 8, transform: [{ scale: 0.8 }] }}>
						<Switch
							trackColor={{ false: COLORS.hoverWhite, true: COLORS.teal }}
							thumbColor={isBillEnabled ? COLORS.softWhite : COLORS.warmGray}
							ios_backgroundColor={COLORS.hoverWhite}
							onValueChange={toggleBillSwitch}
							value={isBillEnabled}
						/>
					</View>
				</SafeAreaView>
				<SafeAreaView
					style={[
						styles.input,
						{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							margin: 8,
						},
					]}
				>
					<Text style={styles.body1}> Unpaid bill notification </Text>
					<View style={{ marginRight: 8, transform: [{ scale: 0.8 }] }}>
						<Switch
							trackColor={{ false: COLORS.hoverWhite, true: COLORS.teal }}
							thumbColor={isUnpaidEnabled ? COLORS.softWhite : COLORS.warmGray}
							ios_backgroundColor={COLORS.hoverWhite}
							onValueChange={toggleUnpaidSwitch}
							value={isUnpaidEnabled}
						/>
					</View>
				</SafeAreaView>
				<SafeAreaView
					style={[
						styles.input,
						{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							margin: 8,
						},
					]}
				>
					<Text style={styles.body1}> Summary notification </Text>
					<View style={{ marginRight: 8, transform: [{ scale: 0.8 }] }}>
						<Switch
							trackColor={{ false: COLORS.hoverWhite, true: COLORS.teal }}
							thumbColor={isSummaryEnabled ? COLORS.softWhite : COLORS.warmGray}
							ios_backgroundColor={COLORS.hoverWhite}
							onValueChange={toggleSummarySwitch}
							value={isSummaryEnabled}
						/>
					</View>
				</SafeAreaView>

				<SafeAreaView style={[styles.container2, { marginTop: 15 }]}>
					<Text style={[styles.heading1, {}]}>Edit profile</Text>
				</SafeAreaView>

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
					style={[styles.submitButton, { marginTop: 15 }]}
					onPress={handleUpdate}
				>
					<Text style={styles.submitText}> Update </Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.input, { marginTop: 25 }]}
					onPress={handleConfirmation}
				>
					<Text style={styles.errorText}> Delete account </Text>
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	);
}

export default Settings;
