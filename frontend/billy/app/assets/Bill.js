import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const Bill = ({ storeName, amount, date, items, splitBetween, icon }) => {
	return (
		<View style={styles.receiptContainer}>
			<View style={styles.headerContainer}>
				<Text style={styles.storeName}>{storeName}</Text>
			</View>
			<Text style={styles.amount}>${amount}</Text>
			<Text style={styles.items}>
				{items} items, split between {splitBetween} people
			</Text>
			<Text style={styles.date}>{date}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	receiptContainer: {
		backgroundColor: "#F0F4F8",
		padding: 15,
		marginVertical: 10,
		borderRadius: 10,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		elevation: 2,
		width: 380,
	},
	headerContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 5,
	},
	storeName: {
		fontSize: 18,
		fontFamily: "PlayfairDisplay_700Bold",
		color: "#2E3A59",
	},
	amount: {
		fontSize: 16,
		fontFamily: "PlayfairDisplay_400Regular",
		color: "#00A86B",
		marginVertical: 5,
	},
	items: {
		fontSize: 14,
		fontFamily: "PlayfairDisplay_400Regular",
		color: "#A0AABF",
	},
	date: {
		fontSize: 12,
		fontFamily: "PlayfairDisplay_400Regular",
		color: "#A0AABF",
		marginTop: 5,
	},
});

export default Bill;
