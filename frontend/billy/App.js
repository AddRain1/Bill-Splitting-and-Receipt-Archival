import {
	PlayfairDisplay_400Regular,
	PlayfairDisplay_400Regular_Italic,
	PlayfairDisplay_500Medium,
	PlayfairDisplay_500Medium_Italic,
	PlayfairDisplay_600SemiBold,
	PlayfairDisplay_600SemiBold_Italic,
	PlayfairDisplay_700Bold,
	PlayfairDisplay_700Bold_Italic,
	PlayfairDisplay_800ExtraBold,
	PlayfairDisplay_800ExtraBold_Italic,
	PlayfairDisplay_900Black,
	PlayfairDisplay_900Black_Italic,
	useFonts,
} from "@expo-google-fonts/playfair-display";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NavigationBar from "./app/assets/NavigationBar";
import BillsPage from "./app/screens/BillsPage";
import CreateAccount from "./app/screens/CreateAccount";
import ForgotPassword from "./app/screens/ForgotPassword";
import LogIn from "./app/screens/LogIn";
import ReceiptsArchivePage from "./app/screens/ReceiptsArchivePage";
import ResetPassword from "./app/screens/ResetPassword";
import ScanPage from "./app/screens/ScanPage";
import Settings from "./app/screens/Settings";
import AddFriendPage from "./app/screens/AddFriendPage";
import FriendsPage from "./app/screens/FriendsPage";
import HomePage from "./app/screens/Home";
import FriendGroups from "./app/screens/FriendGroups";
import { UserProvider } from './UserContext';

const Stack = createNativeStackNavigator();


export default function App() {
	return (
		<UserProvider>
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name="LogIn" component={LogIn} />
				<Stack.Screen name="CreateAccount" component={CreateAccount} />
				<Stack.Screen name="ForgotPassword" component={ForgotPassword} />
				<Stack.Screen name="ResetPassword" component={ResetPassword} />
				<Stack.Screen name="Main" component={NavigationBar} />								
				<Stack.Screen name="Settings" component={Settings} />
				<Stack.Screen name="AddFriendsPage" component={AddFriendPage} />
				<Stack.Screen name="FriendGroupsPage" component={FriendGroups} />
				
			</Stack.Navigator>
		</NavigationContainer>
		</UserProvider>
	);
}
