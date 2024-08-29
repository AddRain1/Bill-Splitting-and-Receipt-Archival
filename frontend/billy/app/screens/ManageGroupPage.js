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

const ManageGroupPage = ({ route, navigation }) => {
  const { groupName, members } = route.params;
  const handleRemoveFriend = (username) => {
		Alert.alert('Remove Friend', `Friend ${username} removed from group.`);
		// Here you would also update your backend or state to remove the friend
	};

	const disbandGroup = () => {
		Alert.alert('Disband Group', 'The group has been disbanded.');
		// Here you would also update your backend to remove the group
		navigation.navigate('HomePage'); // Navigate back to home after disbanding the group
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
            	{groupName}
         </Text> 
         
         <TouchableOpacity style={Styles.returnButtonContainer} onPress={() => navigation.navigate("FriendGroups", { groupName, members })}>
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
         <FlatList
				data={members}
				keyExtractor={(item) => item.username}
				renderItem={({ item }) => (
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
						<View>
							<Text style={{ fontWeight: 'bold' }}>{item.name} ({item.username})</Text>
							<Text>{item.email}</Text>
						</View>
						<TouchableOpacity onPress={() => handleRemoveFriend(item.username)} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#ff6666', padding: 10, borderRadius: 5 }}>
							<Text style={{ color: 'white' }}>remove</Text>
						</TouchableOpacity>
					</View>
				)}
			/>

			<TouchableOpacity onPress={disbandGroup} style={{ marginTop: 20, padding: 15, backgroundColor: '#ff6666', borderRadius: 5, marginHorizontal: 20 }}>
				<Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Disband Group</Text>
			</TouchableOpacity>



        </SafeAreaView>
    );
}

export default ManageGroupPage;