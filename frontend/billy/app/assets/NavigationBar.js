import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Icon2 from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/FontAwesome6";
import colors from "../assets/colors";
import BillsPage from "../screens/BillsPage";
import FriendsPage from "../screens/FriendsPage";
import HomePage from "../screens/Home";
import ReceiptsPage from "../screens/ReceiptsArchivePage";
import ScanPage from "../screens/ScanPage";
import BillsStackNavigator from "./BillsStackNavigator";
import FriendsStackNavigator from "./FriendsStackNavigator";
import HomeStackNavigator from "./HomeStackNavigator";
import ReceiptsStackNavigator from "./ReceiptsStackNavigator";

const Tab = createBottomTabNavigator();

function NavigationBar() {
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
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
					<Icon
						name="square"
						size={25}
						color="#F0F4F8"
						backgroundColor="#F0F4F8"
					/>
				),
				//style={styles.icon}
			}}
		>
			<Tab.Screen
				name="home"
				component={HomeStackNavigator}
				style={styles.tabButton}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Icon name="house" size={25} color={"#F0F4F8"} />
					),
					title: "home", // Optional: Customize the title
				}}
			/>
			<Tab.Screen
				name="receipts"
				component={ReceiptsStackNavigator}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Icon name="receipt" size={25} color={"#F0F4F8"} />
					),
					title: "receipts",
				}}
			/>
			<Tab.Screen
				name="scan"
				component={ScanPage}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Icon name="camera" size={25} color={"#F0F4F8"} />
					),
					title: "scan",
				}}
			/>
			<Tab.Screen
				name="bills"
				component={BillsStackNavigator}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Icon name="money-bill" size={25} color={"#F0F4F8"} />
					),
					title: "bills", // Optional: Customize the title
				}}
			/>
			<Tab.Screen
				name="friends"
				component={FriendsStackNavigator}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Icon name="people-group" size={25} color={"#F0F4F8"} />
					),
					title: "friends",
				}}
			/>
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
