import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { React, useEffect, useState,useRef } from "react";
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
import Tesseract from "tesseract.js";
import { CameraView, useCameraPermissions } from 'expo-camera';
function ScanPage(props) {
	const [image, setImage] = useState("");
	const [showCamera, setShowCamera] = useState(true); // State to control visibility
	const cameraRef = useRef(null);
	const [cameraReady, setCameraReady] = useState(false); // State to track if camera is ready to take picture
	const [cameraProps,setCameraProps] = useState({
		zoom: 0,
		facing: 'back',
		flash: 'off',
		animateShutter: false,
		enableTorch: false
	  })
	

	const [hasCameraPermission, setHasCameraPermission] = useState(null);
	const [tax, setTax] = useState("");
	const [tip, setTip] = useState("");
	const [items, setItems] = useState("");

	useEffect(() => {
		(async () => {
			const { status: cameraStatus } =
				await ImagePicker.requestCameraPermissionsAsync();
			setHasCameraPermission(cameraStatus === "granted");
		})();
	}, []);

	const convertImage = async (image) => {
		try {
			const result = await Tesseract.recognize(image, "eng", {
				logger: (m) => console.log(m),
				tessedit_char_whitelist: '0123456789.',
			});

			const extractedText = result.data.text;
			await sortText(extractedText);

			//Create POST request for text
			const response = await fetch("http://localhost:3000/receipts/add", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ image, tax, tip, items }),
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

		} catch (error) {
			console.error(error);
		}
	};

	const sortText = async (text) => {
		// Guide for matching text
		const twoParams = /(.+?)\s+\$?(\d+\.\d{2})(?![\dA-Za-z/])/g;
		
		let match;
		const items = [];
		const specialLines = { tax: null, tip: null };
	
		// process twoParams for items
		while ((match = twoParams.exec(text)) !== null) {
	
			const [_, itemName, price] = match;
			const trimmedName = itemName.trim();
			const parsedPrice = parseFloat(price);
		
			// Check for special lines
			const taxMatch = trimmedName.match(/\b(TAX|SALES TAX)\b/i);
			const tipMatch = trimmedName.match(/\b(TIP)\b/i);
			const totalMatch = trimmedName.match(/\b(TOTAL|AMOUNT DUE|SUB-TOTAL|SUB TOTAL|SUBTOTAL|AMOUNT|FOOD|CHANGE DUE|CHANGE|CASH|VISA TEND)\b/i);
		
			if (taxMatch) {
				specialLines.tax = parsedPrice;
			} 
			else if (tipMatch) {
				specialLines.tip = parsedPrice;
			}
			else if (!totalMatch) {
				items.push({ name: trimmedName, price: parsedPrice });
			}
		}
	
		setItems(items.map(item => `${item.name}: ${item.price.toFixed(2)}`));
		setTip(specialLines.tip);
		setTax(specialLines.tax);
	};



	const handleImagePickerPress = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
			await convertImage(image);
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
			console.log(image)
			await convertImage(image);
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
