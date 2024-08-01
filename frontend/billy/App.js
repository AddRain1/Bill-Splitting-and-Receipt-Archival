import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_800ExtraBold,
  PlayfairDisplay_900Black,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_500Medium_Italic,
  PlayfairDisplay_600SemiBold_Italic,
  PlayfairDisplay_700Bold_Italic,
  PlayfairDisplay_800ExtraBold_Italic,
  PlayfairDisplay_900Black_Italic,
} from '@expo-google-fonts/playfair-display';
import LogIn from './app/screens/LogIn';
import CreateAccount from './app/screens/CreateAccount';
import ForgotPassword from './app/screens/ForgotPassword';
import ResetPassword from './app/screens/ResetPassword';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './app/screens/Home';
import ScanPage from './app/screens/ScanPage';
import NavigationBar from './app/assets/NavigationBar';
import ReceiptsArchivePage from './app/screens/ReceiptsArchivePage';
import BillsPage from './app/screens/BillsPage';

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NavigationBar from "./app/assets/NavigationBar";
import HomePage from "./app/screens/HomePage";
import ScanPage from "./app/screens/ScanPage";
import Settings from "./app/screens/Settings";

const Stack = createNativeStackNavigator();

export default function App() {
   
  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown: false}}>
 
      <Stack.Screen name ="LogIn" component={LogIn} />
      <Stack.Screen name ="CreateAccount" component={CreateAccount} />
      <Stack.Screen name ="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name ="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="HomePage" component={NavigationBar} />
	  <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name= "ScanPage" component = {ScanPage}/>
      <Stack.Screen name= "ReceiptsArchivePage" component = {ReceiptsArchivePage}/>
      <Stack.Screen name= "BillsPage" component = {BillsPage}/>

      



    </Stack.Navigator>



    </NavigationContainer>
   
  );
}
