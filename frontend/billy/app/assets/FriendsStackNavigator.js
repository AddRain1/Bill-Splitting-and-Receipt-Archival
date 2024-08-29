import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FriendsPage from '../screens/FriendsPage';
// import AddFriendPage from '../screens/AddFriendPage';
// import FriendGroups from '../screens/FriendGroups';

const Stack = createNativeStackNavigator();

const FriendsStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="FriendsPage" component={FriendsPage} />
            {/* <Stack.Screen name ="AddFriendsPage" component={AddFriendPage}/>
            <Stack.Screen name="FriendGroupsPage" component={FriendGroups} /> */}
       
        </Stack.Navigator>
    );
};

export default FriendsStackNavigator;