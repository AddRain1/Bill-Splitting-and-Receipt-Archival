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
  
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();
  const [cameraProps,setCameraProps] = useState({
    zoom: 0,
    facing: 'back',
    flash: 'off',
    animateShutter: false,
    enableTorch: false
  })

  const [image,setImage]= useState(null);

  cam
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
      setIsScanning((prevState) => !prevState);
     
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
      try {
        const result = await cameraRef.current.takePictureAsync();
        setImage(result.uri); // Set the image URI to the state
        console.log(image)
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    } else {
      console.error("Camera reference is null");
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