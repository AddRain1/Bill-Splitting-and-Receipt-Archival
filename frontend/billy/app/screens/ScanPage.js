import {React, useState,useEffect} from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Image, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity,Alert} from 'react-native';
import * as Permissions from 'expo-permissions';
import { useNavigation } from '@react-navigation/native';
import Styles from '/Users/arpitapandey/bill-splitting-and-receipt-archival-1/bill-splitting-and-receipt-archival/app/styles.js';
import NavigationBar from '../assets/NavigationBar';
import colors from '/Users/arpitapandey/bill-splitting-and-receipt-archival-1/bill-splitting-and-receipt-archival/app/assets/colors.js'
import Icon from 'react-native-vector-icons/FontAwesome6';
function ScanPage(props) {

  const [image, setImage] = useState('');

  const [hasCameraPermission, setHasCameraPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');
    })();
  }, []);


  const handleImagePickerPress = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect:[1,1],
      quality: 1,
    })

    if(!result.canceled){
      setImage(result.assets[0].uri)
    }
  }

  const handleLaunchCamera = async () => {
    if (!hasCameraPermission) {
      Alert.alert('Permission required', 'Camera permission is required to use this feature.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  };
  
    return (
      
    <SafeAreaView style={Styles.scanContainer}>
          <View style={Styles.scanWelcome}>
          <Text style={[Styles.heading1, { color: 'black' }, {left: 28}, {fontSize:27},{top: 60} ]}>
              Scan Your Receipt
          </Text>
          </View>

          <View style={Styles.preScan}>
        {image ? (
          <Image source={{ uri: image }} style={Styles.scanImage} />
        ) : (
          <View style={Styles.imagePlaceholder}/>
        )}
         </View>
          <TouchableOpacity style={Styles.cameraButton} onPress={handleImagePickerPress}>
          <Image source={require('/Users/arpitapandey/bill-splitting-and-receipt-archival-1/bill-splitting-and-receipt-archival/app/assets/Imagebutton.jpg')} style ={Styles.cameraButton}/>

          </TouchableOpacity>
          <TouchableOpacity style={Styles.cameraButton1} onPress={handleLaunchCamera}>
          <Image source={require('/Users/arpitapandey/bill-splitting-and-receipt-archival-1/bill-splitting-and-receipt-archival/app/assets/Photo button.jpg')} style ={Styles.cameraButton1}/>

          </TouchableOpacity>


          
    </SafeAreaView>
    

   
   
    );
}

export default ScanPage;