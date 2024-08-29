
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
import Friend from "../assets/Friend.js";

function NewFriendGroupPage(props) {

    const [selectedFriends, setSelectedFriends] = useState([]);
	const navigation = useNavigation();

    const handleAddFriend = (friend) => {
		if (!selectedFriends.some(selected => selected.username === friend.username)) {
			setSelectedFriends([...selectedFriends, friend]);
		} else {
			Alert.alert('Friend already added!');
		}
	};

	const createGroup = () => {
		if (selectedFriends.length > 0) {
			const groupName = `${selectedFriends.map(f => f.name).join(', ')}`;
			Alert.alert('Group Created!', `You have created a group with: ${selectedFriends.map(f => f.name).join(', ')}`);
			navigation.navigate('ManageGroupPage', { groupName, members: selectedFriends });
		} else {
			Alert.alert('No Friends Selected', 'Please select at least one friend to create a group.');
		}
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
            Select to add a friend
         </Text> 
         <TouchableOpacity style={Styles.returnButtonContainer} onPress={() => navigation.navigate("FriendGroupPage")}>
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
         <ScrollView>

         <Friend
         name = "Arpita "
         username = "Arpita123"
         email = "arpitapandeyyy@gmail.com"
         onManagePress={() => handleAddFriend({ name: 'Arpita', username: 'Arpita123', email: 'arpitapandeyyy@gmail.com' })}
         
         
         />
          <Friend
         name = "Adrian "
         username = "Adrian101"
         email = "adrian101@gmail.com"
         onManagePress={() => handleAddFriend({ name: 'Adrian', username: 'AlexS123', email: 'adrian101@gmail.com' })}
         
         
         />
          <Friend
         name = "Justin "
         username = "JustinLu"
         email="justinlu@gmail.com"  // Corrected the email to match the username
         onManagePress={() => handleAddFriend({ name: 'Justin', username: 'JustinLu', email: 'justinlu@gmail.com' })}
         
         
         />
                 <TouchableOpacity
				style={{
					marginTop: 20,
					padding: 15,
					backgroundColor: '#00C896',
					borderRadius: 5,
					marginHorizontal: 20
				}}
				onPress={createGroup}
			>
				<Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
					Create Group
				</Text>
			</TouchableOpacity>
         

        </ScrollView>



       </SafeAreaView>
    );
}

export default NewFriendGroupPage;