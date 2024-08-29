import React, { useEffect, useState } from "react";
import {
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Styles from "../styles";
import Bill from "../assets/Bill";

function BillsPage(props) {
	const [selectedTab, setSelectedTab] = useState("owe"); // 'owe' or 'owed'
	const [sortOption, setSortOption] = useState("date"); // 'date', 'group', 'person'
	const [bills, setBills] = useState([]);

	const sortBills = (bills, option) => {
		switch (option) {
			case "date":
				return bills.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
			case "group":
				return bills.sort((a, b) => a.name.localeCompare(b.name));
			case "person":
				// Assuming you have a person field, replace with actual field
				return bills.sort((a, b) => a.person.localeCompare(b.person));
			default:
				return bills;
		}
	};

	async function loadBills() {
		try {
			const response = await fetch(
				"http://localhost:3000/routes/paymentrequests/",
				{
					method: "GET",
					headers: {
						// 'Authorization': '${authToken}' // Add auth token here
					},
				},
			);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Error:", error);
		}
	}

	// loadBills();
	setBills(sortBills(sortOption));

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
			<ScrollView style={Styles.scrollContainer}>
				{bills.map((bill) => {
					let subtot = 0;
					let people = [];
					for (i = 0; i < bill.items.length; i++) {
						subtot += bill.items[i].price;
						let payeeIndex = people.indexOf(bill.items[i].payee);
						if (payeeIndex === -1) {
							people.push(bill.items[i].payee);
						}
					}		
					return (
						<TouchableOpacity
						onPress={() => navigation.navigate("ReceiptView")}
						>
							<Bill
								storeName = {bill.name}
								amount = {subtot + bill.tip + bill.tax}
								date = {bill.created_at}
								items = {bill.items}
								splitBetween={people.length}
							/>
						</TouchableOpacity>
						// <SafeAreaView key={bill.receipt_id}>
						// 	<Text key={bill.receipt_id}>{bill.receipt_name}</Text>
						// 	<Text key={bill.receipt_id}>{bill.created_at}</Text>
						// </SafeAreaView>
					);
				})}
			</ScrollView>
		</View>
	);
}

export default BillsPage;
