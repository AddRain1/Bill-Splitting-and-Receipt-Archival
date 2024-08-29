import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FriendsPage from '../screens/FriendsPage';
import AddFriendPage from '../screens/AddFriendPage';
import FriendGroups from '../screens/FriendGroups';
import NewFriendGroupPage from '../screens/NewFriendGroupPage';
import ManageGroupPage from '../screens/ManageGroupPage';


const Stack = createNativeStackNavigator();

const FriendsStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="FriendsPage" component={FriendsPage} />
            <Stack.Screen name ="AddFriendsPage" component={AddFriendPage}/>
            <Stack.Screen name="FriendGroups" component={FriendGroups} />
            <Stack.Screen name="NewFriendGroupPage" component={NewFriendGroupPage} />
            <Stack.Screen name="ManageGroupPage" component={ManageGroupPage} />
            
       
        </Stack.Navigator>
    );
};

export default FriendsStackNavigator;