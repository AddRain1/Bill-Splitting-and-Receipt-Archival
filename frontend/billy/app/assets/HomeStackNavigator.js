import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomePage from "../screens/Home";
import ReceiptsArchivePage from "../screens/ReceiptsArchivePage";
import ScanPage from "../screens/ScanPage";
import Settings from "../screens/Settings";

const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="HomePage" component={HomePage} />
			<Stack.Screen name="Receipts" component={ReceiptsArchivePage} />
			<Stack.Screen name="Scan" component={ScanPage} />
			<Stack.Screen name="Settings" component={Settings} />
		</Stack.Navigator>
	);
};

export default HomeStackNavigator;
