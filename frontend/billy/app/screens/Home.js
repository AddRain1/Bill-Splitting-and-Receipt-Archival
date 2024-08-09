import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import React from "react";
import {
	Alert,
	Image,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Octicons } from "react-native-vector-icons";
import WelcomeBar from "../assets/WelcomeBar";
import Styles from "../styles";

import Icon from "react-native-vector-icons/FontAwesome";
import NavigationBar from "../assets/NavigationBar";
import COLORS from "../assets/colors.js";
import BillsPage from "./BillsPage";
import ReceiptsArchivePage from "./ReceiptsArchivePage";
import Settings from "./Settings.js";

function HomePage(props) {
	
	const [font] = useFonts({
		SplineSansMono: require("../assets/fonts/SplineSansMono-Regular.ttf"),
		PlayfairDisplay_400Regular: require("../assets/fonts/PlayfairDisplay-Regular.ttf"),
		PlayfairDisplay_700Bold: require("../assets/fonts/PlayfairDisplay-Bold.ttf"),
	});
	const navigation = useNavigation();

	if (!font) {
		return <AppLoading />;
	}

	return (
		<SafeAreaView style={styles.container}>
			<WelcomeBar />
			<TouchableOpacity
				style={styles.settingsButton}
				onPress={() => navigation.navigate("Settings")}
			>
				<Octicons name="gear" size={32} color={"#008080"} />
			</TouchableOpacity>
			<ScrollView style={styles.container}>
				<View style={styles.summaryContainers}>
					<View style={styles.arrowContainer}>
						<Text style={styles.expenseText}>Expense Breakdown</Text>
						<TouchableOpacity style={styles.goArrow}>
							<Icon
								name="arrow-right"
								size={16}
								color={COLORS.black}
								style={styles.icon}
							/>
						</TouchableOpacity>
					</View>

					<View style={styles.Placeholder} />
				</View>

				<View style={styles.summaryContainers}>
					<View style={styles.arrowContainer}>
						<Text style={styles.billsText}>Summary of Outstanding Bills</Text>
						<TouchableOpacity
							style={styles.goArrow}
							onPress={() => navigation.navigate("BillsPage")}
						>
							<Icon
								name="arrow-right"
								size={16}
								color={COLORS.black}
								style={styles.icon}
							/>
						</TouchableOpacity>
					</View>

					<View style={styles.Placeholder} />
				</View>

				<View style={styles.summaryContainers}>
					<View style={styles.arrowContainer}>
						<Text style={styles.receiptsText}>Recent Receipts</Text>
						<TouchableOpacity
							style={styles.goArrow}
							onPress={() => navigation.navigate("ReceiptsArchivePage")}
						>
							<Icon
								name="arrow-right"
								size={16}
								color={COLORS.black}
								style={styles.icon}
							/>
						</TouchableOpacity>
					</View>

					<View style={styles.Placeholder} />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.white,
	},
	expenseText: {
		fontFamily: "PlayfairDisplay_400Regular",
		width: 380,
		fontSize: 20,
		fontWeight: 500,
	},
	settingsButton: {
		position: "absolute",
		top: 95, // Adjust as needed
		left: 373, // Adjust as needed
	},
	summaryContainers: {
		marginTop: 10,
		width: 380, // Width set to 380px
		height: 214,
	},
	billsText: {
		fontFamily: "PlayfairDisplay_400Regular",
		width: 380,
		fontSize: 20,
		fontWeight: 500,
	},
	receiptsText: {
		fontFamily: "PlayfairDisplay_400Regular",
		width: 380,
		fontSize: 20,
		fontWeight: 500,
	},
	Placeholder: {
		backgroundColor: COLORS.softWhite,
		width: 380,
		height: 150,
		borderRadius: 12,
		left: 26,
		top: 15,
	},
	goArrow: {
		width: 25,
		height: 25,
		backgroundColor: COLORS.teal,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 4,
		right: 30,
	},
	icon: {
		size: 25,
		color: COLORS.white,
	},
	arrowContainer: {
		flexDirection: "row",
		left: 25,
		top: 10,
	},
});

export default HomePage;
