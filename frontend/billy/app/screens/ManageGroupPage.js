import { useFonts } from "@expo-google-fonts/playfair-display";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { React, useState } from "react";
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
} from "react-native";
import COLORS from "../assets/colors.js";
import Styles from "../styles.js";
import Icon from "react-native-vector-icons/FontAwesome";

const ManageGroupPage = ({ FriendGroup }) => {
    return (
        <SafeAreaView>
            <View style={[Styles.receiptsWelcome, { height: 125 }]}>
         <Text
           style={[
             Styles.heading1,
             { left: 25, top: 40, color: "white", marginBottom: 10, alignItems: 'center' }
           ]}
         >
            {FriendGroup.groupName}
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



        </SafeAreaView>
    );
}

export default ManageGroupPage;