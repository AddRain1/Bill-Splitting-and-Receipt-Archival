import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
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
import colors from "/Users/arpitapandey/bill-splitting-and-receipt-archival-1/frontend/billy/app/assets/colors.js";
import Styles from "/Users/arpitapandey/bill-splitting-and-receipt-archival-1/frontend/billy/app/styles.js";
import NavigationBar from "../assets/NavigationBar";
import Tesseract from 'tesseract.js';


function ScanPage(props) {

	const [image, setImage] = useState("");
  const [text, setText] = useState("");
	const [hasCameraPermission, setHasCameraPermission] = useState(null);

	useEffect(() => {
		(async () => {
			const { status: cameraStatus } =
				await ImagePicker.requestCameraPermissionsAsync();
			setHasCameraPermission(cameraStatus === "granted");
		})();
	}, []);

  const convertImage = async (imageURI) => {
    try {
      const result = await Tesseract.recognize(
        imageURI, 'eng',
        {
          logger: m => console.log(m)
        }
      );
      setText(result.data.text);

      //Create POST request
      const resposne = await fetch('http://localhost:3000/saveText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: 'This is the text you want to save',
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }) 
      .then(data => {
        console.log('Success: ', data);
      });
    } catch (error) {
      console.error(error);
    }
  }

	const handleImagePickerPress = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled) {
      imageURI = result.assets[0].uri;
			setImage(imageURI);
      await convertImage(imageURI);
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
			imageURI = result.assets[0].uri;
			setImage(imageURI);
      await convertImage(imageURI);
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
				onPress={handleLaunchCamera}
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
