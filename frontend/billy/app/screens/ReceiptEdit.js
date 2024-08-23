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
import React, { useState, useEffect } from "react";
import {
	SafeAreaView,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
} from "react-native";
import { Feather, Octicons } from "react-native-vector-icons";
import Draggable from "../assets/Draggable";
import NavigationBar from "../assets/NavigationBar";
import COLORS from "../assets/colors";
import styles from "../styles";

// initialItemList = [
// 	{
// 		item_id: 1,
// 		item_name: "Driscoll’s Raspberries (12oz)",
// 		item_price: 5.94,
// 		index: 1,
// 		box: 0,
// 	},
// 	{
// 		item_id: 2,
// 		item_name: "3x Fuji Apples",
// 		item_price: 6.97,
// 		index: 2,
// 		box: 0,
// 	},
// 	{
// 		item_id: 3,
// 		item_name: "Chocolate Chip Cookies",
// 		item_price: 4.55,
// 		index: 3,
// 		box: 0,
// 	},
// 	{
// 		item_id: 4,
// 		item_name: "Ralph’s Purified Drinking Water",
// 		item_price: 5.24,
// 		index: 4,
// 		box: 0,
// 	},
// 	{
// 		item_id: 5,
// 		item_name: "Driscoll’s Raspberries (12oz)",
// 		item_price: 5.94,
// 		index: 5,
// 		box: 1,
// 	},
// 	{
// 		item_id: 6,
// 		item_name: "3x Fuji Apples",
// 		item_price: 6.97,
// 		index: 6,
// 		box: 1,
// 	},
// 	{
// 		item_id: 7,
// 		item_name: "Chocolate Chip Cookies",
// 		item_price: 4.55,
// 		index: 7,
// 		box: 1,
// 	},
// 	{
// 		item_id: 8,
// 		item_name: "Ralph’s Purified Drinking Water",
// 		item_price: 5.24,
// 		index: 8,
// 		box: 1,
// 	},
// ];

// initialBoxStarts = [0, 0];
// boxCounts = [4, 4];

boxCounts = [];

function ReceiptEdit(props) {
	const [font] = useFonts({
		SplineSansMono: require("./../assets/fonts/SplineSansMono-Regular.ttf"),
	});
	const navigation = useNavigation();

	const [scrollEnabled, setScrollEnabled] = useState(true);
	const setDragging = (isDragging) => {
		setScrollEnabled(!isDragging);
	};

	const [itemList, setItemList] = useState([]);
	const [boxStarts, setBoxStarts] = useState([]);

	const [name, setName] = useState("");
	const [title, setTitle] = useState("");
	const [date, setDate] = useState("");
	const [subtotal, setSubtotal] = useState(0);
	const [tip, setTip] = useState(0);

	const people = [];

	async function loadReceipt() {
		try {
			const response = await fetch(
				"http://localhost:3000/routes/users/${id}",
				{
					method: "GET",
					headers: {
						// 'Authorization': '${authToken}' // Add auth token here
					},
				},
			);
			const data = await response.json();
			setName(data.first_name);
			people.push(data.first_name);
		} catch (error) {
			console.error("Error:", error);
		}

		try {
			const response = await fetch(
				"http://localhost:3000/routes/receipts/${id}",
				{
					method: "GET",
					headers: {
						// 'Authorization': '${authToken}' // Add auth token here
					},
				},
			);
			const data = await response.json();
			setTitle(data.title);
			setDate(data.created_at);
			setTip(data.tip);
			setItemList(data.items);
			let subtot = 0;
			for(i = 0; i < itemList.length; i++) {
				subtot += itemList[i].price;
			}
			setSubtotal(subtot);
			setupInitialLists();
		} catch (error) {
			console.error("Error:", error);
		}

	}

	const setupInitialLists = () => {
		for(i = 0; i < itemList.length; i++) {
			let payeeIndex = people.indexOf(itemList[i].payee);
			if( payeeIndex === -1) {
				people.push(itemList[i].payee);
				boxCounts.push(1);
				itemList[i].box = people.length-1;
			} else {
				boxCounts[payeeIndex]++;
				itemList[i].box = payeeIndex;
			}
		}
		boxStarts = new Array(people.length).fill(0);
	}

	const calcBox = (index) => {
		box = 0;
		indexCount = 0;
		for (i = 0; i < boxCounts.length; i++) {
			indexCount += boxCounts[i];
			if (index <= indexCount) {
				box = i;
				break;
			}
		}
		return box;
	};

	const handleIndexChange = (index, newIndex) => {
		const oldBox = calcBox(index);
		const newBox = calcBox(newIndex);

		const updatedItemList = [...itemList];
		const itemToMove = updatedItemList.find((item) => item.index === index);

		if (!itemToMove) return;

		if (oldBox === newBox) {
			for (i = 0; i < updatedItemList.length; i++) {
				// updatedItemList.forEach(item => {
				if (updatedItemList[i].index !== index) {
					if (
						index < newIndex &&
						updatedItemList[i].index > index &&
						updatedItemList[i].index <= newIndex
					) {
						updatedItemList[i].index -= 1;
					} else if (
						index > newIndex &&
						updatedItemList[i].index < index &&
						updatedItemList[i].index >= newIndex
					) {
						updatedItemList[i].index += 1;
					}
				}
				// });
			}
		} else {
			boxCounts[oldBox] -= 1;
			boxCounts[newBox] += 1;

			for (i = 0; i < updatedItemList.length; i++) {
				// updatedItemList.forEach(item => {
				if (updatedItemList[i].index !== index) {
					if (
						index < newIndex &&
						updatedItemList[i].index > index &&
						updatedItemList[i].index <= newIndex
					) {
						updatedItemList[i].index -= 1;
					} else if (
						index > newIndex &&
						updatedItemList[i].index < index &&
						updatedItemList[i].index >= newIndex
					) {
						updatedItemList[i].index += 1;
					}
				}
				// });
			}

			itemToMove.box = newBox;
		}

		itemToMove.index = newIndex;
		setItemList(updatedItemList);
	};

	async function handleSave() {
		for(i = 0; i < itemList.length; i++) {
			itemList[i].payee = people[itemList[i].box];
			delete itemList[i].box;
		}

		try {
			const updateData = {
				name: title,
				created_at: date,
				tip: tip,
				items: itemList,
			};
			const response = await fetch(
				"http://localhost:3000/routes/receipts/${id}/update",
				{
					method: "PUT",
					headers: {
						// 'Authorization': '${authToken}' // Add auth token here
					},
					body: JSON.stringify(updateData),
				},
			);
			navigation.navigate("ReceiptView")
		} catch (error) {
			console.error("Error:", error);
		}
	}

	loadReceipt();

	return (
		<SafeAreaView style={styles.container}>
			<SafeAreaView style={styles.topBar}>
				<SafeAreaView style={[styles.container2, { height: 50 }]} />
				<Text style={[styles.caption2, { left: 25 }]}> {date} </Text>
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
						{title}
					</Text>
					<Octicons name="clock" size={32} color={COLORS.yellow} />
				</SafeAreaView>
			</SafeAreaView>
			<SafeAreaView style={styles.subBar}>
				<TouchableOpacity
					style={[styles.subBarButton, { left: 30 }]}
					onPress={() => navigation.navigate("ReceiptView")}
				>
					<Octicons name="arrow-left" size={25} color={COLORS.gray} />
					<Text style={[styles.caption, { color: COLORS.gray }]}> cancel </Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.subBarButton, { left: 250 }]}
					onPress={() => handleSave()}
				>
					<Feather name="save" size={25} color={COLORS.gray} />
					<Text style={[styles.caption, { color: COLORS.gray }]}> save </Text>
				</TouchableOpacity>
			</SafeAreaView>
			<ScrollView
				contentContainerStyle={styles.scroll}
				showsVerticalScrollIndicator={false}
				scrollEnabled={scrollEnabled}
			>
				<SafeAreaView style={[styles.container2, { width: 380 }]}>
					<SafeAreaView
						style={[
							styles.container2,
							{
								width: 380,
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 10,
							},
						]}
					>
						<Text style={[styles.caption, { fontSize: 14 }]}> Title: </Text>
						<TextInput
							style={[styles.editInput, { paddingLeft: 10, paddingRight: 10 }]}
							value = {title}
							onChangeText={setTitle}
						/>
					</SafeAreaView>
					<SafeAreaView
						style={[
							styles.container2,
							{
								width: 380,
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 10,
							},
						]}
					>
						<Text style={[styles.caption, { fontSize: 14 }]}> Date: </Text>
						<TextInput
							style={[styles.editInput, { paddingLeft: 10, paddingRight: 10 }]}
							value = {date}
							onChangeText={setDate}
						/>
					</SafeAreaView>
					<SafeAreaView
						style={[
							styles.container2,
							{
								width: 380,
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 10,
							},
						]}
					>
						<Text style={[styles.caption, { fontSize: 14 }]}>
							{" "}
							Subtotal ($):{" "}
						</Text>
						<TextInput
							style={[styles.editInput, { paddingLeft: 10, paddingRight: 10 }]}
							value = {subtotal}
							onChangeText={setSubtotal}
						/>
					</SafeAreaView>
					<SafeAreaView
						style={[
							styles.container2,
							{
								width: 380,
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 10,
							},
						]}
					>
						<Text style={[styles.caption, { fontSize: 14 }]}> Tip: </Text>
						<TextInput
							style={[styles.editInput, { paddingLeft: 10, paddingRight: 10 }]}
							value = {tip}
							onChangeText={setTip}
						/>
					</SafeAreaView>
					<SafeAreaView
						style={[styles.grayDivider, { width: 430, marginTop: 10 }]}
					/>

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
							{name}
						</Text>
					</SafeAreaView>
					<SafeAreaView
						style={[styles.container3, { height: 40 * boxCounts[0] + 10 }]}
						onLayout={(e) => {
							const newBoxStarts = [...boxStarts];
							newBoxStarts[0] = e.nativeEvent.layout.y + 10;
							setBoxStarts(newBoxStarts);
						}}
					/>

					<SafeAreaView
						style={[
							styles.container2,
							{
								width: 380,
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: 0,
							},
						]}
					>
						<SafeAreaView
							style={[
								styles.container2,
								{
									flexDirection: "row",
									alignItems: "center",
									marginBottom: 10,
									marginTop: 25,
								},
							]}
						>
							<Text style={[styles.caption, { fontSize: 14 }]}> Others: </Text>
							<Text style={[styles.editInput, {}]}> {people.length-1} </Text>
						</SafeAreaView>
						<TouchableOpacity>
							<Octicons
								name="plus-circle"
								size={24}
								color={COLORS.black}
								style={{ marginTop: 20, marginRight: 8 }}
							/>
						</TouchableOpacity>
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
							{people[1]}
						</Text>
						<SafeAreaView
							style={[
								styles.container2,
								{ flexDirection: "row", alignItems: "center", marginBottom: 0 },
							]}
						>
							<Octicons
								name="clock"
								size={24}
								color={COLORS.yellow}
								style={{ marginRight: 15, marginTop: 25, marginBottom: 10 }}
							/>
							<TouchableOpacity
								style={{
									backgroundColor: COLORS.hoverGray,
									width: 40,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Octicons
									name="x"
									size={24}
									color={COLORS.red}
									style={{ marginTop: 25, marginBottom: 10 }}
								/>
							</TouchableOpacity>
						</SafeAreaView>
					</SafeAreaView>
					<SafeAreaView
						style={[styles.container3, { height: 40 * boxCounts[1] + 10 }]}
						onLayout={(e) => {
							const newBoxStarts = [...boxStarts];
							newBoxStarts[1] = e.nativeEvent.layout.y + 10;
							setBoxStarts(newBoxStarts);
						}}
					/>

					{itemList.map((item, i) => {
						return (
							<Draggable
								key={item.item_id}
								item_name={item.item_name}
								item_price={item.item_price}
								onDraggingChange={setDragging}
								index={i}
								itemList={itemList}
								boxStarts={boxStarts}
								boxCounts={boxCounts}
								onIndexChange={handleIndexChange}
							/>
						);
					})}
				</SafeAreaView>
			</ScrollView>
		</SafeAreaView>
	);
}

export default ReceiptEdit;
