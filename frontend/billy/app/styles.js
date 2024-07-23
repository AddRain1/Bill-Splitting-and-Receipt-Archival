import {StyleSheet} from 'react-native';
import COLORS from './assets/colors';

export default styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: COLORS.white,
      alignItems: 'center',
  },
  container2: {
    justifyContent: 'left',
    backgroundColor: 'transparent',
    width: 330,
    marginBottom: 15,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold_Italic',
    top: 10,
    height: 150,
    fontSize: 48,
  },
  heading1: {
      fontFamily: 'PlayfairDisplay_700Bold',
      fontSize: 32, 
  },
  backButton: {
      flexDirection: 'row',
      marginBottom: 100,
  },
  buttonText: {
      fontFamily: 'SplineSansMono',
      fontSize: 16, 
      color: COLORS.mint,
    },
  input: {
      backgroundColor: COLORS.softWhite,
      color: COLORS.black,
      height: 40,
      width: 330,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      borderRadius: 4,
      fontFamily: 'SplineSansMono',
      gap: 28,
    },
  submitButton: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 118,
      backgroundColor: COLORS.mint,
      height:43,
      borderRadius:12,
      marginBottom: 10
  },
  submitText: {
      fontSize: 20,
      fontFamily:'SplineSansMono',
      color: COLORS.softWhite,
  },
  pressedText:{
    fontFamily: 'SplineSansMono',
    color: COLORS.mint,
    width:330,
    height: 60,
    left: 60,
    top: 400,
    marginTop: -40,
    fontSize: 14

  },
  image: {
    width: 124,
    height: 124,
    // Add other styling properties as needed
  }, 
  accountButton: {
    height: 19,
    margin: 10,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  caption: {
    fontFamily: 'SplineSansMono',
    color: COLORS.gray,
    
  },
  errorText: {
    fontFamily: 'SplineSansMono',
    color: COLORS.red,
    fontSize: 14,
  },
  body1: {
    fontFamily: 'SplineSansMono',
    color: COLORS.black,
    fontSize: 14,
  },
  navBar:{
    position: 'absolute',
    bottom: -710,
    left: 0,
    right: 0,
  },
  scroll: {
    alignItems: 'center', 
    paddingVertical: 20
  },
})