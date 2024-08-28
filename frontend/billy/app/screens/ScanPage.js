import { useNavigation } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { React, useEffect, useRef, useState } from "react";
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
	const [showCamera, setShowCamera] = useState(true); // State to control visibility
	const cameraRef = useRef(null);
	const [cameraReady, setCameraReady] = useState(false); // State to track if camera is ready to take picture
	const [cameraProps, setCameraProps] = useState({
		zoom: 0,
		facing: "back",
		flash: "off",
		animateShutter: false,
		enableTorch: false,
	});

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
			quality: 1,
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
			setShowCamera(false); // Hide camera when image is selected
			setCameraReady(false); // Reset camera readiness
		}
	};
	const handleCameraButtonPress = () => {
		if (cameraReady) {
			// If camera is ready, take the picture
			takePicture();
		} else {
			// If camera is not ready, clear the image and make camera ready
			setImage(""); // Clear the current image
			setCameraReady(true); // Set camera as ready to take picture
			setShowCamera(true); // Show the camera
		}
	};

	const takePicture = async () => {
		if (cameraRef.current) {
			try {
				const result = await cameraRef.current.takePictureAsync();
				setImage(result.uri); // Set the image URI to the state
				console.log(image);
				setShowCamera(false); // Hide the camera after taking the picture
				setCameraReady(false); // Reset camera readiness
			} catch (error) {
				console.error("Error taking picture:", error);
			}
		} else {
			console.error("Camera reference is null");
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
				{showCamera ? (
					<CameraView
						style={Styles.scanImage}
						facing={cameraProps.facing}
						ref={cameraRef}
					/>
				) : (
					<Image source={{ uri: image }} style={Styles.scanImage} />
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
				onPress={handleCameraButtonPress}
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
