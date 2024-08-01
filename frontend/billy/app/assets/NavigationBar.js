<<<<<<< HEAD
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, SafeAreaView,Image } from 'react-native';
import HomePage from '../screens/Home';
import ReceiptsPage from '../screens/ReceiptsArchivePage';
import ScanPage from '../screens/ScanPage';
import BillsPage from '../screens/BillsPage';
import colors from  '/Users/arpitapandey/bill-splitting-and-receipt-archival-1/frontend/billy/app/assets/colors.js';
import Icon from 'react-native-vector-icons/FontAwesome6';


=======
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
import colors from "/Users/arpitapandey/bill-splitting-and-receipt-archival-1/frontend/billy/app/assets/colors.js";
import BillsPage from "../screens/BillsPage";
import HomePage from "../screens/Home";
import ReceiptsPage from "../screens/ReceiptsArchivePage";
import ScanPage from "../screens/ScanPage";
>>>>>>> 771c83881dad5de062af4345ed72833f516bd215

const Tab = createBottomTabNavigator();

function NavigationBar() {
<<<<<<< HEAD
    return (
      <Tab.Navigator 
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#008080',
          height: 100, // Adjust height as needed
          paddingBottom: 10, // Adjust padding as needed
        },
        tabBarLabelStyle: {
          fontSize: 12, // Adjust font size as needed
          marginBottom: 5, // Adjust margin as needed
        },
        tabBarIconStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarActiveTintColor: '#F0F4F8', // Color of the active tab text/icon
        tabBarInactiveTintColor: '#F0F4F8', // Color of the inactive tab text/icon
        tabBarIcon: ({ color, size }) => (
          <Icon name="square"  size={25} color="#F0F4F8" backgroundColor= '#F0F4F8'  />
        ),
        //style={styles.icon}
   
      }} >
        <Tab.Screen name="HomePage" component={HomePage} style={styles.tabButton} />
        <Tab.Screen name="receipts" component={ReceiptsPage} />
        <Tab.Screen name="scan" component={ScanPage} />
        <Tab.Screen name="bills" component={BillsPage} />
        
      </Tab.Navigator>
    );
  }
=======
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
				name="HomePage"
				component={HomePage}
				style={styles.tabButton}
			/>
			<Tab.Screen name="receipts" component={ReceiptsPage} />
			<Tab.Screen name="scan" component={ScanPage} />
			<Tab.Screen name="bills" component={BillsPage} />
		</Tab.Navigator>
	);
}
>>>>>>> 771c83881dad5de062af4345ed72833f516bd215

const styles = StyleSheet.create({
	icon: {
		justifyContent: "center",
		alignItems: "center",
	},
});

export default NavigationBar;
