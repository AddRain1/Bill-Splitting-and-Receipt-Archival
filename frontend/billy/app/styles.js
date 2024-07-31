import { StyleSheet } from "react-native";

const COLORS = {
  teal: '#008080',
  mint: '#00C896',
  black: '#3A3A3A',
  gray: '#6E7B91',
  white: '#FDFDFD',
  softWhite: '#F0F4F8',
}

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
  scanContainer: {
    
    justifyContent: 'left',
    backgroundColor: 'white',
    height: 120,
    width: '100%',
    top: -15,
    borderRadius: 10

  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold_Italic',
    top: 10,
    height: 150,
    fontSize: 48,
  },
  heading1: {
      fontFamily: 'PlayfairDisplay_400Regular',
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
  navBar:{
    position: 'absolute',
    bottom: -710,
    left: 0,
    right: 0,
  },
  scanPageMain:{
    flex: 1, // This will make the view take up the available space
    backgroundColor: COLORS.black,
    zIndex: -1,
    top:27
    
    

  },
  cameraButton:{
    position: 'absolute',
    top:383,
    left:150,
    borderRadius:30,
    width: 48,
    height:48

  },
  cameraButton1:{
    position: 'absolute',
    top:375,
    left:90,
    borderRadius:40,
    width: 70,
    height:70

  },
  scanImage:{
    position:'absolute',
    width:366,
    height:660,
    top: -20,
    left: 28,
    

    

  },
  scanContainer:{
    flex:1,
    backgroundColor: COLORS.black,
  },
  scanWelcome:{
    backgroundColor: COLORS.white,
    top:-50,
    height:103,
    borderRadius: 10

  },
  imagePlaceholder:{
    position:'absolute',
    width:366,
    height:660,
    top: -20,
    left: 28,
    backgroundColor: '#808080',
    borderWidth:3,
    borderColor: COLORS.white

  },
  receiptsWelcome:{
    top:0,
    width:430,
    height:150,
    backgroundColor: COLORS.teal

  },
  searchText:{
    color: COLORS.black
   
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    top:70,
    backgroundColor: COLORS.white

  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    marginHorizontal: 0,
    alignItems: 'center',
    height:50
  },
  selectedTab: {
    backgroundColor:'#D3DCE6',
    borderColor: '#007B83',
    
  },

  tabText: {
    fontSize: 16,
    fontFamily: 'SplineSansMono',
    color: COLORS.teal
    

  },
  sortTab: {
    flex: 1,
    paddingVertical: 2,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    marginHorizontal: 0,
    alignItems: 'center',
    height:28
  },
  sortTabText: {
    fontSize: 14,
    fontFamily: 'SplineSansMono',
    color: COLORS.teal
    

  },
  
  

  
})
  
