import { useFonts } from "@expo-google-fonts/playfair-display";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
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
import { SearchBar } from "react-native-elements";
import COLORS from "../assets/colors.js";
import Styles from "../styles.js";
import Bill from "../assets/Bill.js";
//import { getAllReceipts } from '../../../../backend/src/receiptsAPI';

function ReceiptsArchivePage(props) {

	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	
	const updateSearch = (search) => {
		setSearch(search);
	};
	const [font] = useFonts({
		SplineSansMono: require("./../assets/fonts/SplineSansMono-Regular.ttf"), // Adjust the path accordingly
	});

	const bills = [
        {
            storeName: "Ralph’s Fresh Fare",
            amount: 35.16,
            date: "2024-06-21",
            items: 8,
            splitBetween: 2,
            icon: "clock-o"  // Icon name from FontAwesome
        },
        {
            storeName: "Costco",
            amount: 77.32,
            date: "2024-06-17",
            items: 11,
            splitBetween: 4,
            icon: "list-alt"
        },
        {
            storeName: "Tacos El Gordos",
            amount: 16.98,
            date: "2024-06-17",
            items: 2,
            splitBetween: 1,
            icon: "check"
        },
        {
            storeName: "Legoland California",
            amount: 89.80,
            date: "2024-05-29",
            items: 2,
            splitBetween: 1,
            icon: "check"
        }
    ];

	return (
		<SafeAreaView style={Styles.container}>
			<View style={Styles.receiptsWelcome}>
				<Text
					style={[
						Styles.heading1,
						{ left: 25 },
						{ top: 25 },
						{ color: "white" },
					]}
				>
					Receipt Archive
				</Text>

				<SearchBar
					placeholder="enter keywords"
					placeholderTextColor={COLORS.black}
					onChangeText={updateSearch}
					value={search}
					searchIcon={null}
					inputStyle={{
						color: COLORS.black,
						fontSize: 16,
						fontFamily: "SplineSansMono",
					}}
					inputContainerStyle={{
						backgroundColor: "white",
						height: 27, // Change height here
						width: 360,
						alignSelf: "center",
						justifyContent: "center",
					}}
					containerStyle={{
						height: 33,
						top: 43,
						backgroundColor: "white",
						borderTopWidth: 0,
						borderBottomWidth: 0,
						width: 380, // Change width here
						alignSelf: "center",
						justifyContent: "center",
					}}
				/>
			</View>



			<ScrollView  style={Styles.receiptContainer}>
			{bills.map((bill, index) => (
                <Bill
				 key={index}
				 storeName={bill.storeName}
				 amount={bill.amount}
				 date={bill.date}
				 items={bill.items}
				 splitBetween={bill.splitBetween}
				 icon={bill.icon}
                />
            ))}


		    </ScrollView>
		</SafeAreaView>
	);
}

export default ReceiptsArchivePage;
