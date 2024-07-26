import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import React from "react";
import {
	Alert,
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Octicons } from "react-native-vector-icons";
import WelcomeBar from "../assets/WelcomeBar";

import colors from "/Users/arpitapandey/bill-splitting-and-receipt-archival-1/bill-splitting-and-receipt-archival/app/assets/colors.js";
import NavigationBar from "../assets/NavigationBar";

function HomePage(props) {
	const [font] = useFonts({
		SplineSansMono: require("/Users/arpitapandey/bill-splitting-and-receipt-archival-1/bill-splitting-and-receipt-archival/app/assets/fonts/SplineSansMono-Regular.ttf"),
		PlayfairDisplay_400Regular: require("/Users/arpitapandey/bill-splitting-and-receipt-archival-1/bill-splitting-and-receipt-archival/app/assets/fonts/PlayfairDisplay-Regular.ttf"),
		PlayfairDisplay_700Bold: require("/Users/arpitapandey/bill-splitting-and-receipt-archival-1/bill-splitting-and-receipt-archival/app/assets/fonts/PlayfairDisplay-Bold.ttf"),
	});

	if (!font) {
		return <AppLoading />;
	}

	return (
		<SafeAreaView styles={styles.container}>
			<WelcomeBar />
			<Text style={styles.expenseText}> Expense Breakdown</Text>
			<TouchableOpacity
				style={styles.settingsButton}
				onPress={() => navigation.navigate("LogIn")}
			>
				<Octicons name="gear" size={32} color={"#008080"} />
			</TouchableOpacity>
			<View style={styles.navBar}>
				<NavigationBar />
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "background",
	},
	expenseText: {
		fontFamily: "PlayfairDisplay_400Regular",
		width: 380,
		fontSize: 24,
		fontWeight: 500,
		left: 25,
		top: 10,
	},
	settingsButton: {
		position: "absolute",
		top: 95, // Adjust as needed
		left: 373, // Adjust as needed
	},
	navBar: {
		position: "absolute",
		bottom: -710,
		left: 0,
		right: 0,
	},
});

export default HomePage;
