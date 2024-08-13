import React, { useRef, useState, useEffect } from "react";
import { Animated, PanResponder, Text } from "react-native";
import { Feather } from "react-native-vector-icons";
import COLORS from "../assets/colors";
import styles from "../styles";

selfBoxStarts = [0, 0];

const Draggable = ({
	item_name,
	item_price,
	onDraggingChange,
	index,
	itemList,
	boxStarts,
	boxCounts,
	onIndexChange,
}) => {
	const position = useRef(new Animated.ValueXY()).current;
	const [dragging, setDragging] = useState(false);

	function calcBoxPosition() {
		let count = 0;
		for (i = 0; i < itemList[index].box; i++) {
			count += boxCounts[i];
		}
		return itemList[index].index - count;
	}

	useEffect(() => {
		if (boxStarts[0] !== undefined && !Number.isNaN(index)) {
			Animated.spring(position, {
				toValue: {
					x: 0,
					y: boxStarts[itemList[index].box] + 40 * (calcBoxPosition() - 1),
				},
				useNativeDriver: false,
			}).start();
		}
	}, [itemList, boxStarts, index, position, calcBoxPosition]);

	useEffect(() => {
		selfBoxStarts = [...boxStarts];
	}, [boxStarts]);

	function calcIndex() {
		let box = 0;
		for (i = selfBoxStarts.length - 1; i >= 0; i--) {
			if (position.y._value > selfBoxStarts[i]) {
				box = i;
				break;
			}
		}
		temp = Math.floor((position.y._value - selfBoxStarts[box]) / 40) + 1;
		if (temp < 1) {
			temp = 1;
		}
		if (temp > boxCounts[box]) {
			temp = boxCounts[box];
		}
		for (i = 0; i < box; i++) {
			temp += boxCounts[i];
		}
		return temp;
	}

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: () => true,
			onPanResponderGrant: () => {
				setDragging(true);
				onDraggingChange(true);
				position.setOffset({
					x: position.x._value,
					y: position.y._value,
				});
				position.setValue({ x: 0, y: 0 });
			},
			onPanResponderMove: Animated.event(
				[
					null,
					{
						dy: position.y,
					},
				],
				{ useNativeDriver: false },
			),
			onPanResponderRelease: () => {
				setDragging(false);
				onDraggingChange(false);
				position.flattenOffset();
				const newIndex = calcIndex();
				onIndexChange(itemList[index].index, newIndex);
			},
		}),
	).current;

	return (
		<Animated.View
			style={[
				styles.listRow,
				{
					transform: position.getTranslateTransform(),
					backgroundColor: COLORS.softWhite,
					position: "absolute",
					zIndex: dragging ? 1 : 0,
					opacity: dragging ? 0.8 : 1,
				},
			]}
			{...panResponder.panHandlers}
		>
			<Text
				style={[styles.editInput, { backgroundColor: COLORS.white, flex: 1 }]}
				numberOfLines={1}
			>
				{" "}
				{item_name}{" "}
			</Text>
			<Text
				style={[
					styles.editInput,
					{ backgroundColor: COLORS.white, marginLeft: 10, marginRight: 10 },
				]}
			>
				{" "}
				${item_price}{" "}
			</Text>
			<Feather name="move" size={20} color={COLORS.gray} />
		</Animated.View>
	);
};

export default Draggable;
