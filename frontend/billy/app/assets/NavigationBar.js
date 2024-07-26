import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
import colors from "/Users/arpitapandey/bill-splitting-and-receipt-archival-1/bill-splitting-and-receipt-archival/app/assets/colors.js";
import BillsPage from "../screens/BillsPage";
import HomePage from "../screens/LogIn";
import ReceiptsPage from "../screens/ReceiptsPage";
import ScanPage from "../screens/ScanPage";

const Tab = createBottomTabNavigator();

function NavigationBar() {
	return (
		<Tab.Navigator
			screenOptions={{
				tabBarStyle: {
					backgroundColor: "#008080",
					height: 100, // Adjust height as needed
					paddingBottom: 10, // Adjust padding as needed
				},
				tabBarLabelStyle: {
					fontSize: 12, // Adjust font size as needed
					marginBottom: 5, // Adjust margin as needed
				},
				tabBarIconStyle: {
					justifyContent: "center",
					alignItems: "center",
				},
				tabBarActiveTintColor: "#F0F4F8", // Color of the active tab text/icon
				tabBarInactiveTintColor: "#F0F4F8", // Color of the inactive tab text/icon
				tabBarIcon: ({ color, size }) => (
					<Icon name="f0c8" size={16} color="#F0F4F8" style={styles.icon} />
				),
			}}
		>
			<Tab.Screen name="home" component={HomePage} style={styles.tabButton} />
			<Tab.Screen name="receipts" component={ReceiptsPage} />
			<Tab.Screen name="scan" component={ScanPage} />
			<Tab.Screen name="bills" component={BillsPage} />
		</Tab.Navigator>
	);
}

const styles = StyleSheet.create({
	icon: {
		justifyContent: "center",
		alignItems: "center",
	},
});

export default NavigationBar;