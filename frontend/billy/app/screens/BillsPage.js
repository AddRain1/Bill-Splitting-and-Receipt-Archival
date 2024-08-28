import React, { useEffect, useState } from "react";
import {
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Bill from "../assets/Bill";
import Styles from "../styles";

function BillsPage(props) {
	const [selectedTab, setSelectedTab] = useState("owe"); // 'owe' or 'owed'
	const [sortOption, setSortOption] = useState("date"); // 'date', 'group', 'person'

	const sortBills = (bills, option) => {
		switch (option) {
			case "date":
				return bills.sort((a, b) => new Date(b.date) - new Date(a.date));
			case "group":
				return bills.sort((a, b) => a.name.localeCompare(b.name));
			case "person":
				// Assuming you have a person field, replace with actual field
				return bills.sort((a, b) => a.person.localeCompare(b.person));
			default:
				return bills;
		}
	};

	const bills = [
		{
			receipt_id: 1,
			storeName: "Ralph’s Fresh Fare",
			amount: 35.16,
			date: "2024-06-21",
			items: 8,
			splitBetween: 2,
		},
		{
			receipt_id: 2,
			storeName: "Costco",
			amount: 77.32,
			date: "2024-06-17",
			items: 11,
			splitBetween: 4,
		},
		{
			receipt_id: 3,
			storeName: "Tacos El Gordos",
			amount: 16.98,
			date: "2024-06-17",
			items: 2,
			splitBetween: 1,
		},
		{
			receipt_id: 4,
			storeName: "Legoland California",
			amount: 89.8,
			date: "2024-05-29",
			items: 2,
			splitBetween: 1,
		},
	];

	return (
		<View style={Styles.container}>
			<View style={[Styles.receiptsWelcome, { height: 190 }]}>
				<Text
					style={[
						Styles.heading1,
						{ color: "white" },
						{ left: 25 },
						{ top: 35 },
					]}
				>
					Bills
				</Text>
				<View style={Styles.tabs}>
					<TouchableOpacity
						onPress={() => setSelectedTab("owe")}
						style={[Styles.tab, selectedTab === "owe" && Styles.selectedTab]}
					>
						<Text style={Styles.tabText}>bills you owe</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setSelectedTab("owed")}
						style={[Styles.tab, selectedTab === "owed" && Styles.selectedTab]}
					>
						<Text style={Styles.tabText}>bills owed to you</Text>
					</TouchableOpacity>
				</View>
				<View style={Styles.tabs}>
					<TouchableOpacity
						onPress={() => setSortOption("date")}
						style={[
							Styles.sortTab,
							sortOption === "date" && Styles.selectedTab,
						]}
					>
						<Text
							style={[
								Styles.sortTabText,
								sortOption === "date" && Styles.selectedTabText,
							]}
						>
							date
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setSortOption("group")}
						style={[
							Styles.sortTab,
							sortOption === "group" && Styles.selectedTab,
						]}
					>
						<Text
							style={[
								Styles.sortTabText,
								sortOption === "group" && Styles.selectedTabText,
							]}
						>
							group
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setSortOption("person")}
						style={[
							Styles.sortTab,
							sortOption === "person" && Styles.selectedTab,
						]}
					>
						<Text
							style={[
								Styles.sortTabText,
								sortOption === "person" && Styles.selectedTabText,
							]}
						>
							person
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			<ScrollView style={Styles.billContainer}>
				{bills.map((bill) => (
					<Bill
						key={bill.receipt_id}
						storeName={bill.storeName}
						amount={bill.amount}
						date={bill.date}
						items={bill.items}
						splitBetween={bill.splitBetween}
					/>
				))}
			</ScrollView>
		</View>
	);
}

export default BillsPage;
