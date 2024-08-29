import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '../screens/Home';
import ReceiptsArchivePage from '../screens/ReceiptsArchivePage';
import ScanPage from '../screens/ScanPage';
import Settings from '../screens/Settings';
import BillsPage from '../screens/BillsPage';
import FriendGroups from '../screens/FriendGroups';

const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomePage" component={HomePage} />
            <Stack.Screen name="Receipts" component={ReceiptsArchivePage} />
            <Stack.Screen name="Bill" component={BillsPage} />
            <Stack.Screen name="Groups" component={FriendGroups} />

            <Stack.Screen name="Settings" component={Settings} />

        </Stack.Navigator>
    );
};

export default HomeStackNavigator;