import { useFonts } from "@expo-google-fonts/playfair-display";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Permissions from "expo-permissions";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect,useRef } from "react";
import { Camera,CameraType,CameraView} from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

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
    Switch
} from "react-native";
import COLORS from "../assets/colors.js";
import Styles from "../styles.js";
import Icon from "react-native-vector-icons/FontAwesome";
import { CameraType } from "expo-camera/build/legacy/Camera.types.js";

function AddFriendPage(props) {
    const [isScanning, setIsScanning] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [image, setImage] = useState(null);
    const [facing, setFacing] = useState(CameraType.back);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const cameraRef = useRef(null);
  
    useEffect(() => {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(status === 'granted');
      })();
    }, []);
  
    const handlePress = () => {
      setIsScanning(prevState => !prevState);
    };
  
    const navigation = useNavigation();
  
    const handleTakePicture = async () => {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({ quality: 1, base64: true });
        setImage(photo.uri);
      }
    };
  

    return (
        <SafeAreaView style={Styles.container}>
           <View style={[Styles.receiptsWelcome, {height:125}]}>
				<Text
					style={[
						Styles.heading1,
						{ left: 25},
						{ top: 40 },
						{ color: "white" },
                        {marginBotton: 10},
                        {alignItems: 'center'}

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
                    <View style={[{left:10}]}>
                     <Text style={Styles.returnButtonText}>
                         return
                     </Text>

                    </View>
                    
                </TouchableOpacity>
                </View>

                <View style={Styles.addFriend} >
                    <Text style={[Styles.heading1, {fontSize: 24}, {marginBottom:10}]}>Add via user id</Text>
                    <Text style={[Styles.caption,{color:COLORS.black},{marginBottom:10}]}>Your user id: </Text>
                    <Text style={[Styles.caption,{color:COLORS.black}]}>Enter friend's id: </Text>

                </View >

                <View style={[Styles.addFriend, {marginTop:15}]}>


                    <Text style={[Styles.heading1, {fontSize: 24}, {marginBottom:10}]}>Add via qr code</Text>
                    

                         <View style={Styles.qrCodeContainer}>
                         <View style={Styles.qrCodeContainer}>
                          {isScanning ? (
						                <Camera style={Styles.camera} type={facing} ref={cameraRef}>
								              <View style={Styles.cameraButtonWrapper}>
									            <TouchableOpacity style={Styles.cameraButton2} onPress={handleTakePicture}>
										        <Image
											        source={require("../assets/Photo_button.jpg")}
											          style={Styles.cameraButton2}
										          />
									          </TouchableOpacity>
									            < Text style={Styles.qrCodeText}>Scanning...</Text>
								          </View>
							          </Camera>
						          ) : (
							<View style={Styles.qrCodePlaceHolder}>
								{/* Replace this with your QR code display component */}
								<Text>Your QR code will be displayed here</Text>
							</View>
						)}
					</View>

                         <TouchableOpacity style={Styles.switchButton} onPress={handlePress}>
                        <Text style={Styles.switchButtonText}>
                            {isScanning ? "or display your qr code" : "or scan friend's qr code"}
                            </Text>
                     </TouchableOpacity>

                </View>
            </View>




        </SafeAreaView>
    );
}

export default AddFriendPage;