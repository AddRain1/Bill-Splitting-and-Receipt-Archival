import {StyleSheet} from 'react-native';
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        
      },
    heading1: {
        fontFamily: 'PlayfairDisplay_700Bold',
        height: 56,
        top: 100,
        right: 50,
        fontSize: 32,
        
    },
    backButton: {
        flexDirection: 'row',
        height: 40,
        top: 110,
        right:90,
        marginBottom: 100,
    },
    buttonText: {
        fontFamily: 'SplineSansMono',
        color: '#00C896',
      },
    input: {
        top:130,
        backgroundColor: '#F0F4F8',
        color: '3A3A3A',
        height: 40,
        width: 330,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 4
     
      },
    mintButton: {
        top:50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00C896',
        borderRadius:12


    },
    signUpText: {
        fontSize: 18,
        fontFamily:'SplineSansMono',
        color: '#F0F4F8',

        
    }
        
})