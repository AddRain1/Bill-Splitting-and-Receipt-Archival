import { useNavigation } from "@react-navigation/native";
// import * as ImagePicker from "expo-image-picker";
// import * as Permissions from "expo-permissions";
import { React, useEffect, useState } from "react";
import {
	Alert,
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
import NavigationBar from "../assets/NavigationBar";
import colors from "../assets/colors.js";
import Styles from "../styles.js";
function ScanPage(props) {
	const [image, setImage] = useState("");

	const [hasCameraPermission, setHasCameraPermission] = useState(null);

	useEffect(() => {
		(async () => {
			const { status: cameraStatus } =
				await ImagePicker.requestCameraPermissionsAsync();
			setHasCameraPermission(cameraStatus === "granted");
		})();
	}, []);

	const handleImagePickerPress = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	const handleLaunchCamera = async () => {
		if (!hasCameraPermission) {
			Alert.alert(
				"Permission required",
				"Camera permission is required to use this feature.",
			);
			return;
		}

		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	return (
		<SafeAreaView style={Styles.scanContainer}>
			<View style={Styles.scanWelcome}>
				<Text
					style={[
						Styles.heading1,
						{ color: "black" },
						{ left: 28 },
						{ fontSize: 27 },
						{ top: 60 },
					]}
				>
					Scan Your Receipt
				</Text>
			</View>

			<View style={Styles.preScan}>
				{image ? (
					<Image source={{ uri: image }} style={Styles.scanImage} />
				) : (
					<View style={Styles.imagePlaceholder} />
				)}
			</View>
			<TouchableOpacity
				style={Styles.cameraButton}
				onPress={handleImagePickerPress}
			>
				<Image
					source={require("../assets/Imagebutton.jpg")}
					style={Styles.cameraButton}
				/>
			</TouchableOpacity>
			<TouchableOpacity
				style={Styles.cameraButton1}
				// onPress={handleLaunchCamera}
			>
				<Image
					source={require("../assets/Photo button.jpg")}
					style={Styles.cameraButton1}
				/>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

export default ScanPage;
