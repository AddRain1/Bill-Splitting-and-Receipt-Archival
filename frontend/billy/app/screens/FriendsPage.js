import { useFonts } from "@expo-google-fonts/playfair-display";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { React, useState } from "react";
import {
	Alert,
	FlatList,
	Image,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import COLORS from "../assets/colors.js";
import Styles from "../styles.js";

function FriendsPage(props) {
	const navigation = useNavigation();

	return (
		<SafeAreaView style={Styles.container}>
			<View style={[Styles.receiptsWelcome, { height: 100 }]}>
				<Text
					style={[
						Styles.heading1,
						{ left: 35.83 },
						{ top: 40 },
						{ color: "white" },
					]}
				>
					Friends
				</Text>
			</View>

			<View
				style={[
					Styles.input,
					{
						top: 20,
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						margin: 8,
						width: 380,
						borderColor: "transparent",
					},
				]}
			>
				<Text style={Styles.body1}> Add friends </Text>

				<View style={Styles.arrowContainer}>
					<TouchableOpacity
						style={Styles.goArrow}
						onPress={() => navigation.navigate("AddFriendsPage")}
					>
						<Icon
							name="arrow-right"
							size={16}
							color={COLORS.black}
							style={Styles.icon}
						/>
					</TouchableOpacity>
				</View>
			</View>

			<View
				style={[
					Styles.input,
					{
						top: 20,
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						margin: 8,
						width: 380,
						borderColor: "transparent",
					},
				]}
			>
				<Text style={Styles.body1}> Friend groups </Text>

				<View style={Styles.arrowContainer}>
					<TouchableOpacity
						style={Styles.goArrow}
						onPress={() => navigation.navigate("FriendGroupsPage")}
					>
						<Icon
							name="arrow-right"
							size={16}
							color={COLORS.black}
							style={Styles.icon}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
}

export default FriendsPage;
