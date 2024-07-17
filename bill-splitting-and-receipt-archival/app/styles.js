import {StyleSheet} from 'react-native';

const COLORS = {
  teal: '#fff',
  mint: '#00C896',
  black: '#3A3A3A',
  gray: '',
  white: '#fff',
  softWhite: '#F0F4F8',
}

export default styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: COLORS.white,
      alignItems: 'center',
      
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
      margin: 20,
    },
  submitButton: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 118,
      backgroundColor: COLORS.mint,
      height:43,
      borderRadius:12
  },
  submitText: {
      fontSize: 20,
      fontFamily:'SplineSansMono',
      color: COLORS.softWhite,
  },
  pressedText:{
    fontFamily: 'SplineSansMono',
    color: '#00C896',
    width:330,
    height: 60,
    left: 60,
    top: 400,
    marginTop: -40,
    fontSize: 14

} 
})