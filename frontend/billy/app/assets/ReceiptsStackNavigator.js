import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomePage from "../screens/Home";
import ReceiptsArchivePage from "../screens/ReceiptsArchivePage";
import NavigationBar from "./NavigationBar";

const Stack = createNativeStackNavigator();

const ReceiptsStackNavigator = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen
				name="ReceiptsArchivePage"
				component={ReceiptsArchivePage}
			/>
			<Stack.Screen name="HomePage" component={HomePage} />
		</Stack.Navigator>
	);
};

export default ReceiptsStackNavigator;
