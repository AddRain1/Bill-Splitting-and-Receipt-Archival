import { useFonts } from "@expo-google-fonts/playfair-display";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { React, useState,useEffect } from "react";
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
	View
} from "react-native";
import COLORS from "../assets/colors.js";
import Styles from "../styles.js";
import Icon from "react-native-vector-icons/FontAwesome";
import FriendGroup from "../assets/FriendGroup.js";
import NewFriendGroupPage from "./NewFriendGroupPage.js";

function FriendGroups({ route, navigation }) {
  const [groups, setGroups] = useState([
		{
			groupName: "Grocery",
			members: ["Jordan W.", "Taylor S."],
			bills: "4",
		},
		{
			groupName: "Untitled",
			members: ["User’s name", "friend 1"],
			bills: "#",
		},
	]);

    useEffect(() => {
      if (route.params?.groupName && route.params?.members) {
        const newGroup = {
          groupName: route.params.groupName,
          members: route.params.members.map(member => member.name), // Ensure we pass only names
          bills: "0", // Default bills count for new groups
        };
        setGroups([...groups, newGroup]);
      }
    }, [route.params]);
  
    const handleManageGroup = (group) => {
      navigation.navigate('ManageGroupPage', { groupName: group.groupName, members: group.members });
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
         
         <View style={Styles.newFriendContainer}>
          <Text style={Styles.newFriendGroupText}>New Friend Group</Text>
          <TouchableOpacity
							style={Styles.goArrow2}
							onPress={() => navigation.navigate("NewFriendGroupPage")}
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

      <FlatList
					data={groups}
					keyExtractor={(item) => item.groupName}
					renderItem={({ item }) => (
						<FriendGroup 
							groupName={item.groupName} 
							members={item.members} 
							bills={item.bills} 
							onManagePress={() => handleManageGroup(item)}
						/>
					)}
				/>
      </View>
      
       </SafeAreaView>
       
    );
}

export default FriendGroups;