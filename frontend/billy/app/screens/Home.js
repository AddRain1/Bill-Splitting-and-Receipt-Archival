import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import React from "react";
import Receipt from "../assets/Receipts.js";
import SummaryContainer from "../assets/SummaryContainer.js";
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
import FriendGroup from "../assets/FriendGroup.js";

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
			<WelcomeBar username="Taylor"/>
			<TouchableOpacity
				style={styles.settingsButton}
				onPress={() => navigation.navigate("Settings")}
			>
				<Octicons name="gear" size={32} color={"#008080"} />
			</TouchableOpacity>
			<ScrollView style={styles.container}>
				<View style={styles.summaryContainers}>
					
					<View style={styles.arrowContainer}>
						<Text style={styles.billsText}>Groups</Text>
						<TouchableOpacity
							style={styles.goArrow}
							onPress={() => navigation.navigate("Groups")}
						>
							<Icon
								name="arrow-right"
								size={16}
								color={COLORS.black}
								style={styles.icon}
							/>
						</TouchableOpacity>
					</View>
					<View style={Styles.friendGroups}>
						<FriendGroup 
						groupName="Costco group" 
						members={['Alex S.', 'Jill M.', 'Grace X.']} 
						bills="2"
						onManagePress={() => console.log('Manage Costco group')}
						/>
						<FriendGroup 
						groupName="Grocery" 
						members={['Jordan W.', 'Taylor S.']} 
						bills="4"
						onManagePress={() => console.log('Manage Grocery')}
						/>

						
					</View>

					
				</View>

				<View style={[styles.summaryContainers]}>
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
                   <View style={styles.Summary}>
				    <SummaryContainer />

				   </View>
					
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
						<View style={styles.receiptContainer}>
					  <Receipt storeName="Ralph’s Fresh Fare" amount="35.16" date="24/06/21" />
            		  <Receipt storeName="Costco" amount="77.32" date="24/06/17" />
            		  <Receipt storeName="Tacos El Gordos" amount="16.98" date="24/06/17" />
					  </View>
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
		marginTop: 10, // Width set to 380px
		height: 214,
		marginBottom:10,
		
		
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
		top: 15,
	},
	container2: {
        
        backgroundColor: '#FFFFFF',
        flex: 1,
		top: 30,
		left:20,
    },
	Summary:{
		padding:10,
		

		

	},
	receiptContainer: {
		marginTop: 15, // Width set to 380px
		height: 214,
		width:380,
		left:20,
		marginBottom:10,
		
		
	},

   

});

export default HomePage;
