import {
	PlayfairDisplay_400Regular,
	PlayfairDisplay_400Regular_Italic,
	PlayfairDisplay_500Medium,
	PlayfairDisplay_500Medium_Italic,
	PlayfairDisplay_600SemiBold,
	PlayfairDisplay_600SemiBold_Italic,
	PlayfairDisplay_700Bold,
	PlayfairDisplay_700Bold_Italic,
	PlayfairDisplay_800ExtraBold,
	PlayfairDisplay_800ExtraBold_Italic,
	PlayfairDisplay_900Black,
	PlayfairDisplay_900Black_Italic,
	useFonts,
} from "@expo-google-fonts/playfair-display";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity } from "react-native";
import { Feather, Octicons } from "react-native-vector-icons";
import NavigationBar from "../assets/NavigationBar";
import COLORS from "../assets/colors";
import styles from "../styles";

itemList = [
	{
		item_id: 1,
		item_name: "Driscoll’s Raspberries (12oz)",
		item_price: 5.94,
	},
	{
		item_id: 2,
		item_name: "3x Fuji Apples",
		item_price: 6.97,
	},
	{
		item_id: 3,
		item_name: "Chocolate Chip Cookies",
		item_price: 4.55,
	},
	{
		item_id: 4,
		item_name: "Ralph’s Purified Drinking Water",
		item_price: 5.24,
	},
];

function ReceiptView(props) {
	const [font] = useFonts({
		SplineSansMono: require("./../assets/fonts/SplineSansMono-Regular.ttf"),
	});
	const navigation = useNavigation();

	return (
		<SafeAreaView style={styles.container}>
			<SafeAreaView style={styles.topBar}>
				<SafeAreaView
					style={[styles.container2, { height: 50 }]}
				></SafeAreaView>
				<Text style={[styles.caption2, { left: 25 }]}> 06/21/2024 </Text>
				<SafeAreaView
					style={[
						styles.container2,
						{
							left: 25,
							width: 380,
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
						},
					]}
				>
					<Text style={[styles.heading1, { color: COLORS.softWhite }]}>
						{" "}
						Ralph's Fresh Fare{" "}
					</Text>
					<Octicons name="clock" size={32} color={COLORS.yellow} />
				</SafeAreaView>
			</SafeAreaView>
			<SafeAreaView style={styles.subBar}>
				<TouchableOpacity style={[styles.subBarButton, { left: 30 }]}>
					<Octicons name="arrow-left" size={25} color={COLORS.gray} />
					<Text style={[styles.caption, { color: COLORS.gray }]}> return </Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.subBarButton, { left: 160 }]}>
					<Octicons name="image" size={25} color={COLORS.gray} />
					<Text style={[styles.caption, { color: COLORS.gray }]}> view </Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.subBarButton, { left: 175 }]}
					onPress={() => navigation.navigate("ReceiptEdit")}
				>
					<Feather name="edit" size={25} color={COLORS.gray} />
					<Text style={[styles.caption, { color: COLORS.gray }]}> edit </Text>
				</TouchableOpacity>
			</SafeAreaView>
			<ScrollView
				contentContainerStyle={styles.scroll}
				showsVerticalScrollIndicator={false}
			>
				<SafeAreaView style={[styles.container2, { width: 380 }]}>
					<Text style={[styles.heading2, { left: -20, marginBottom: 20 }]}>
						{" "}
						$35.16{" "}
					</Text>

					<Text style={[styles.caption, { fontSize: 14, marginBottom: 5 }]}>
						{" "}
						You:{" "}
					</Text>
					<SafeAreaView
						style={[styles.container3, { backgroundColor: COLORS.softGray }]}
					>
						<Text
							style={[
								styles.body1,
								{
									fontSize: 18,
									color: COLORS.black,
									marginTop: 25,
									marginBottom: 10,
									left: 10,
								},
							]}
						>
							{" "}
							Taylor{" "}
						</Text>
					</SafeAreaView>
					<SafeAreaView style={styles.container3}>
						<SafeAreaView
							style={[styles.container2, { height: 15, marginBottom: 0 }]}
						></SafeAreaView>
						{itemList.map((prop) => {
							return (
								<SafeAreaView style={[styles.listRow, {}]} key={prop.item_id}>
									<Text
										style={[styles.caption, { fontSize: 14 }]}
										key={prop.item_id}
									>
										{" "}
										{prop.item_name}{" "}
									</Text>
									<Text
										style={[styles.caption, { fontSize: 14 }]}
										key={prop.item_id}
									>
										{" "}
										${prop.item_price}{" "}
									</Text>
								</SafeAreaView>
							);
						})}

						<SafeAreaView style={{ width: 380, alignItems: "center" }}>
							<SafeAreaView style={styles.grayDivider} />
						</SafeAreaView>
						<SafeAreaView style={[styles.listRow, {}]}>
							<Text style={[styles.caption, { fontSize: 14 }]}> Subtotal </Text>
							<Text style={[styles.caption, { fontSize: 14 }]}> $22.70 </Text>
						</SafeAreaView>
						<SafeAreaView style={[styles.listRow, {}]}>
							<Text style={[styles.caption, { fontSize: 14 }]}>
								{" "}
								Sales Tax{" "}
							</Text>
							<Text style={[styles.caption, { fontSize: 14 }]}> $1.76 </Text>
						</SafeAreaView>
						<SafeAreaView style={[styles.listRow, {}]}>
							<Text style={[styles.caption, { fontSize: 14 }]}> Tip </Text>
							<Text style={[styles.caption, { fontSize: 14 }]}> $2.00 </Text>
						</SafeAreaView>

						<SafeAreaView style={{ width: 380, alignItems: "center" }}>
							<SafeAreaView style={styles.grayDivider} />
						</SafeAreaView>
						<SafeAreaView style={[styles.listRow, { marginBottom: 15 }]}>
							<Text style={[styles.caption, { fontSize: 14 }]}> Total </Text>
							<Text style={[styles.caption, { fontSize: 14 }]}> $26.46 </Text>
						</SafeAreaView>
					</SafeAreaView>

					<SafeAreaView
						style={[
							styles.container2,
							{
								width: 380,
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 10,
								marginTop: 25,
							},
						]}
					>
						<Text style={[styles.caption, { fontSize: 14 }]}> Others: </Text>
						<Text style={[styles.editInput, {}]}> 1 </Text>
					</SafeAreaView>
					<SafeAreaView
						style={[
							styles.container3,
							{
								backgroundColor: COLORS.softGray,
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
							},
						]}
					>
						<Text
							style={[
								styles.body1,
								{
									fontSize: 18,
									color: COLORS.black,
									marginTop: 25,
									marginBottom: 10,
									left: 10,
								},
							]}
						>
							{" "}
							Jordan{" "}
						</Text>
						<Octicons
							name="clock"
							size={24}
							color={COLORS.yellow}
							style={{ marginRight: 15, marginTop: 25, marginBottom: 10 }}
						/>
					</SafeAreaView>
					<SafeAreaView style={styles.container3}>
						<SafeAreaView
							style={[styles.container2, { height: 15, marginBottom: 0 }]}
						></SafeAreaView>
						{itemList.map((prop) => {
							return (
								<SafeAreaView style={[styles.listRow, {}]} key={prop.item_id}>
									<Text
										style={[styles.caption, { fontSize: 14 }]}
										key={prop.item_id}
									>
										{" "}
										{prop.item_name}{" "}
									</Text>
									<Text
										style={[styles.caption, { fontSize: 14 }]}
										key={prop.item_id}
									>
										{" "}
										${prop.item_price}{" "}
									</Text>
								</SafeAreaView>
							);
						})}

						<SafeAreaView style={{ width: 380, alignItems: "center" }}>
							<SafeAreaView style={styles.grayDivider} />
						</SafeAreaView>
						<SafeAreaView style={[styles.listRow, {}]}>
							<Text style={[styles.caption, { fontSize: 14 }]}> Subtotal </Text>
							<Text style={[styles.caption, { fontSize: 14 }]}> $22.70 </Text>
						</SafeAreaView>
						<SafeAreaView style={[styles.listRow, {}]}>
							<Text style={[styles.caption, { fontSize: 14 }]}>
								{" "}
								Sales Tax{" "}
							</Text>
							<Text style={[styles.caption, { fontSize: 14 }]}> $1.76 </Text>
						</SafeAreaView>
						<SafeAreaView style={[styles.listRow, {}]}>
							<Text style={[styles.caption, { fontSize: 14 }]}> Tip </Text>
							<Text style={[styles.caption, { fontSize: 14 }]}> $2.00 </Text>
						</SafeAreaView>

						<SafeAreaView style={{ width: 380, alignItems: "center" }}>
							<SafeAreaView style={styles.grayDivider} />
						</SafeAreaView>
						<SafeAreaView style={[styles.listRow, { marginBottom: 15 }]}>
							<Text style={[styles.caption, { fontSize: 14 }]}> Total </Text>
							<Text style={[styles.caption, { fontSize: 14 }]}> $26.46 </Text>
						</SafeAreaView>
					</SafeAreaView>
				</SafeAreaView>
			</ScrollView>
		</SafeAreaView>
	);
}

export default ReceiptView;
