import { useFonts } from "expo-font";
import React from "react";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
const WelcomeBar = ({ username }) => {

    const [font] = useFonts({
        'SplineSansMono': require('./../assets/fonts/SplineSansMono-Regular.ttf'),
        'PlayfairDisplay_400Regular': require('./../assets/fonts/PlayfairDisplay-Regular.ttf'),
        'PlayfairDisplay_700Bold': require('./../assets/fonts/PlayfairDisplay-Bold.ttf'),
    });

    if (!font) {
     return <AppLoading />;
    }
  return (
    <View style={styles.container}>
      <Image source={require('./../assets/logo.jpeg')} style ={styles.image}/>
      <Text style={styles.welcomeText}>hello,  {username}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#ECF1F5",
		flexDirection: "row",
		height: 131,
		width: 430,
		alignItems: "center",
	},
	welcomeText: {
		color: "#000000",
		fontSize: 22,
		fontWeight: "bold",
		left: 50,
		fontFamily: "PlayfairDisplay_400Regular",
	},
	image: {
		width: 50,
		height: 50,
		left: 25,
		borderRadius: 12,
	},
});
export default WelcomeBar;
