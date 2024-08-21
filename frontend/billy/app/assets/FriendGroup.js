import React from 'react';
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
import Icon from 'react-native-vector-icons/FontAwesome';
const truncateMembers = (members, maxLength) => {
    const joinedMembers = members.join(', ');
    if (joinedMembers.length > maxLength) {
      return joinedMembers.substring(0, maxLength - 3) + '...';
    }
    return joinedMembers;
  };
  

const FriendGroup = ({ groupName, members, bills,onManagePress }) => {
    return (
        <View style={styles.groupContainer}>
            <View>
                <Text style={styles.groupName}>{groupName}</Text>
                <Text style={styles.bills}> ({bills})</Text>

                <Text style={styles.groupMembers}>{truncateMembers(members, 28)}</Text>
           </View>

           <TouchableOpacity style={styles.manageButton} onPress={onManagePress}>
                <Text style={styles.manageButtonText}>Manage</Text>
          </TouchableOpacity>
                
       
            
        </View>
    );
};

const styles = StyleSheet.create({
  
    groupContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      width:380,
      backgroundColor: '#F0F4f8'
    },
    groupName: {
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'SplineSansMono'
    },
    groupMembers: {
      fontSize: 14,
      color: '#555',
      fontFamily: 'SplineSansMono'
    },
    manageButton: {
      backgroundColor: '#b5e3df',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    manageButtonText: {
      color: '#fff',
      fontSize: 14,
    },
  });
  
  export default FriendGroup;
