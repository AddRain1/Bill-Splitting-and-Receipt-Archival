import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BillsPage from '../screens/BillsPage';
import NavigationBar from './NavigationBar';

const Stack = createNativeStackNavigator();

const BillsStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="BillsPage" component={BillsPage} />
            <Stack.Screen name="HomePage" component={NavigationBar} />
        </Stack.Navigator>
    );
};

export default BillsStackNavigator;