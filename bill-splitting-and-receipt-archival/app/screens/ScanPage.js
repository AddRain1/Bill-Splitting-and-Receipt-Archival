import React, { useState, useEffect } from 'react'
import { Image } from 'react-native'
import DocumentScanner from 'react-native-document-scanner-plugin'
import {NavigationContainer} from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
// import Scanner from '/Users/arpitapandey/bill-splitting-and-receipt-archival-1/bill-splitting-and-receipt-archival/app/assets/scanner.js'

function ScanPage(props) {
    

    return (
       <Scanner/>
    );
    
}

export default ScanPage;