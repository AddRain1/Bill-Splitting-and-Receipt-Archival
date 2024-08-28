import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "./colors";

const User = ({ name, amount, bills }) => {
	return (
		<View style={styles.userContainer}>
			<Text style={styles.name}>{name}</Text>
			<Text style={styles.amount}>{`$${amount}`}</Text>

			<Text style={styles.bills}>{bills} bills</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	userContainer: {
		backgroundColor: "transparent",
		margin: 10,
		flexDirection: "row",
		justifyContent: "space-between",
	},

	amount: {
		fontSize: 12,
		color: "#00C896",
		fontFamily: "SplineSansMono",
	},
	name: {
		fontSize: 12,
		color: "black",
		fontFamily: "SplineSansMono",
	},
	bills: {
		fontSize: 12,
		color: "#A0AABF",
		fontFamily: "SplineSansMono",
	},
});

export default User;
