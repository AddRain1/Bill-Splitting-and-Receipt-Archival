import { useFonts } from "@expo-google-fonts/playfair-display";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Permissions from "expo-permissions";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useRef } from "react";

import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  Button
} from "react-native";
import COLORS from "../assets/colors.js";
import Styles from "../styles.js";
import Icon from "react-native-vector-icons/FontAwesome";
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

function AddFriendPage(props) {
  
  const [isScanning, setIsScanning] = useState(false);
  const [displayImage, setDisplayImage] = useState(false);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();
  const [showCamera, setShowCamera] = useState(true); // State to control visibility
  const [cameraProps,setCameraProps] = useState({
    zoom: 0,
    facing: 'back',
    flash: 'off',
    animateShutter: false,
    enableTorch: false
  })

  const [image,setImage]= useState(null);


  const [isCameraReady, setIsCameraReady] = useState(false); // Add camera readiness state
  const [barcodeData, setBarcodeData] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isTakingPicture, setIsTakingPicture] = useState(false);

  useEffect(() => {
    if (!isScanning) {
      setImage(null);  // Reset image when scanning is turned off
    }
  }, [isScanning]);



  const handlePress = () => {
    if (!isTakingPicture) {
      if (isScanning) {
        // If already scanning, switch to display mode
        setIsScanning(false);
        setShowCamera(false);
      } else {
        // If not scanning, reset image, show camera, and start scanning
        setImage(null); // Clear the previously captured image
        setShowCamera(true); // Show the camera
        setIsScanning(true);
      }
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }


  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={Styles.container}>
        <Text style={Styles.message}>We need your permission to continue</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      setIsTakingPicture(true); // Disable the button during the process
      try {
        const result = await cameraRef.current.takePictureAsync();
        setImage(result.uri); // Update the image state
        setShowCamera(false); // Hide the camera
      } catch (error) {
        Alert.alert("Error", "Failed to take picture. Please try again.");
      } finally {
        setIsTakingPicture(false); // Re-enable the button
        
      }
    } else {
      Alert.alert("Error", "Camera is not ready.");
    }
  };

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setBarcodeData(data);
    setIsScanning(false);  
  };
  


  

  



  return (
    <SafeAreaView style={Styles.container}>
      
         <View style={[Styles.receiptsWelcome, { height: 125 }]}>
         <Text
           style={[
             Styles.heading1,
             { left: 25, top: 40, color: "white", marginBottom: 10, alignItems: 'center' }
           ]}
         >
           Add friends
         </Text>
 
         <TouchableOpacity style={Styles.returnButtonContainer} onPress={() => navigation.navigate("FriendsPage")}>
           <Icon
             name="arrow-left"
             size={16}
             color={COLORS.black}
             style={Styles.icon}
           />
           <View style={{ left: 10 }}>
             <Text style={Styles.returnButtonText}>
               return
             </Text>
           </View>
         </TouchableOpacity>
       </View>
 
       <View style={Styles.addFriend}>
         <Text style={[Styles.heading1, { fontSize: 24, marginBottom: 10 }]}>Add via user id</Text>
         <Text style={[Styles.caption, { color: COLORS.black, marginBottom: 10 }]}>Your user id:</Text>
         <Text style={[Styles.caption, { color: COLORS.black }]}>Enter friend's id:</Text>
       </View>
 
       <View style={[Styles.addFriend, { marginTop: 15 }]}>
         <Text style={[Styles.heading1, { fontSize: 24, marginBottom: 10 }]}>Add via qr code</Text>
 
         {isScanning ? (
          <View style={Styles.qrCodeContainer}>
           {showCamera ? (
					 <CameraView
           style={Styles. qrCodeScanner}               
           facing={cameraProps.facing}
           onCameraReady={handleCameraReady} // Set camera ready state
           ref = {cameraRef}
           onBarCodeScanned={isScanning ? handleBarCodeScanned : undefined}
           barcodeScannerSettings={{
             barcodeTypes: ["qr"]
           }}    
     />
				) : (
					<Image source={{ uri: image }} style={Styles.qrCodeScanner} />
				)}
            <TouchableOpacity
              style={Styles.cameraButton2}
              onPress={takePicture}
              disabled={isTakingPicture} // Disable the button while taking a picture
            >
              <Image
                source={require("../assets/Photo button.jpg")}
                style={Styles.cameraButton2}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={Styles.qrCodeContainer}>
            {image ? (
					<Image source={{ uri: image }} style={Styles.qrCodePlaceHolder} />
				) : (
					<View style={Styles.qrCodePlaceHolder} />
				)}
          </View>
        )}

        <TouchableOpacity style={Styles.switchButton} onPress={handlePress} >
          <Text style={Styles.switchButtonText}>
            {isScanning
              ? "or display your QR code"
              : "or scan friend's QR code"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default AddFriendPage;