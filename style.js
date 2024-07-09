import {StyleSheet} from 'react-native';

const page = StyleSheet.create({
    background: {
        backgroundColor: '#FDFDFD', 
    },
    container: {
        color: '#F0F4F8',
        borderRadius: 4,
        overflow: 'hidden'
    },
    menuBar: {
        color: '#008080',
        justifyContent: 'space-around'
    },
    divisionBar: {
        color: '#B3E5FC',
        height: 4,
        borderTopRightRadius: 4,
        borderTopLeftRadius:4
    }
  });

  const typography = StyleSheet.create({
    title: {
        fontsize: 48,
        fontFamily: 'Playfair Display',
        fontWeight: 'bold',
        color: '#3A3A3A'
    },
    heading1: {
        fontsize: 32,
        fontFamily: 'Playfair Display',
        color: '#3A3A3A'
    },
    heading2: {
        fontsize: 32,
        fontFamily: 'Playfair Display',
        color: '#FDFDFD'
    },
    heading3: {
        fontsize: 24,
        fontFamily: 'Playfair Display',
        color: '#3A3A3A'
    },
    heading4: {
        fontsize: 18,
        fontFamily: 'Spline Sans Mono',
        color: '#3A3A3A'
    },
    heading5: {
        fontsize: 24,
        fontFamily: 'Playfair Display',
        color: '#6E7B91',
        textDecorationLine: 'underline'
    },
    body1: {
        fontsize: 14,
        fontFamily: 'Spline Sans Mono',
        color: '#3A3A3A'
    },
    body2: {
        fontsize: 14,
        fontFamily: 'Spline Sans Mono',
        color: '#6E7B91'
    },
    caption1: {
        fontsize: 12,
        fontFamily: 'Spline Sans Mono',
        color: '#F0F4F8'
    },
    caption2: {
        fontsize: 16,
        fontFamily: 'Spline Sans Mono',
        color: '#6E7B91'
    },
    caption3: {
        fontsize: 16,
        fontFamily: 'Spline Sans Mono',
        color: '#00C896'
    },
    textField: {
        fontsize: 16,
        fontFamily: 'Spline Sans Mono',
        color: '#3A3A3A',
        padding: 8,
        borderRadius: 4,
        backgroundColor: '#F0F4F8'
    },
    errorText: {
        fontsize: 14,
        fontFamily: 'Spline Sans Mono',
        color: '#FF6F61'
    },
    yellowText: {
        fontsize: 14,
        fontFamily: 'Spline Sans Mono',
        color: '#FFC107'
    }
  });

  const buttons = StyleSheet.create({
    tealButton: {
        backgroundColor: '#008080',
        color: '#F0F4F8',
        '&:hover': {
            backgroundColor: '#006666',
            color: '#D3DCE6',
        },
    },
    grayButton: {
        backgroundColor: '#F0F4F8',
        color: '#008080',
        borderColor: '#008080', 
        borderWidth: 2, 
        borderStyle: 'solid',
        '&:hover': {
            backgroundColor: '#D3DCE6',
            color: '#006666',
            borderColor: '#006666', 
            borderWidth: 2, 
            borderStyle: 'solid',
        },
    },
    mintButton: {
        backgroundColor: '#00C896',
        color: '#F0F4F8',
        '&:hover': {
            backgroundColor: '#009973',
            color: '#D3DCE6',
        },
    },
  });