import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../screens/LogIn';

const Tab = createBottomTabNavigator();


function MyTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="home" component={HomePage} />
        <Tab.Screen name="receipts" component={SettingsScreen} />
        <Tab.Screen name="receipts" component={SettingsScreen} />
        <Tab.Screen name="scan" component={SettingsScreen} />
        <Tab.Screen name="friends" component={SettingsScreen} />
        
      </Tab.Navigator>
    );
  }