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
import FriendGroup from "../assets/FriendGroup.js";

function FriendGroups(props) {
    const navigation = useNavigation(); 
    return (
        <SafeAreaView style={Styles.container}>
      
         <View style={[Styles.receiptsWelcome, { height: 125 }]}>
         <Text
           style={[
             Styles.heading1,
             { left: 25, top: 40, color: "white", marginBottom: 10, alignItems: 'center' }
           ]}
         >
            Friend groups
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
         <ScrollView contentContainerStyle={Styles.scrollViewContent}>
         <View style={Styles.newFriendContainer}>
          <Text style={Styles.newFriendGroupText}>New Friend Group</Text>
          <TouchableOpacity
							style={Styles.goArrow2}
							onPress={() => navigation.navigate("BillsPage")}
						>
							<Icon
								name="arrow-right"
								size={16}
								color={COLORS.black}
								style={Styles.icon}
							/>
						</TouchableOpacity>
         </View>

         <View style={Styles.friendGroupContainer}>

         <FriendGroup 
        groupName="Costco group" 
        members={['Alex S.', 'Jill M.', 'Grace X.']} 
        bills="2"
        onManagePress={() => console.log('Manage Costco group')}
      />
      <FriendGroup 
        groupName="Grocery" 
        members={['Jordan W.', 'Taylor S.']} 
        bills="4"
        onManagePress={() => console.log('Manage Grocery')}
      />
      <FriendGroup 
        groupName="Untitled" 
        members={['User’s name', 'friend 1']} 
        bills="#"
        onManagePress={() => console.log('Manage Untitled group')}
      />
      </View>
      </ScrollView>
       </SafeAreaView>
       
    );
}

export default FriendGroups;