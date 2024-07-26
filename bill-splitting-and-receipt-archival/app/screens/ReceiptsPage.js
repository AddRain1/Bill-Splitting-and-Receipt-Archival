import {React, useState} from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity,Alert,ScrollView} from 'react-native';
import Styles from '/Users/arpitapandey/bill-splitting-and-receipt-archival-1/bill-splitting-and-receipt-archival/app/styles.js';
import { COLORS } from '/Users/arpitapandey/bill-splitting-and-receipt-archival-1/bill-splitting-and-receipt-archival/app/assets/colors.js';
import { SearchBar } from 'react-native-elements';
import {useFonts} from '@expo-google-fonts/playfair-display';


function ReceiptsPage(props) {

    const [search, setSearch] = useState('');

    const updateSearch = (search) => {
        setSearch(search);
    };
    const [font] = useFonts({
        'SplineSansMono': require('./../assets/fonts/SplineSansMono-Regular.ttf'), // Adjust the path accordingly
      });

    return (
        <SafeAreaView style={Styles.container}>
            <View style={Styles.receiptsWelcome}>
                <Text style={[Styles.heading1, {left:25}, {top:25}, {color: 'white'}]}>
                    Reciept Archive
                </Text>

                <SearchBar
                 placeholder="enter keywords"
                 placeholderTextColor={COLORS.black}
                 onChangeText={updateSearch}
                 value={search}
                 searchIcon={null}
                 inputStyle={{ 
                    color: COLORS.black,
                    fontSize: 16,
                    fontFamily: 'SplineSansMono'
                }}
                 inputContainerStyle={{
                     backgroundColor: 'white',
                     height:27,// Change height here
                     width: 360,
                     alignSelf: 'center',
                     justifyContent: 'center',
                     
                 }}
                 containerStyle={{
                    height:33,
                    top:43,
                     backgroundColor:'white',
                     borderTopWidth: 0,
                     borderBottomWidth: 0,
                     width: 380, // Change width here
                     alignSelf: 'center', 
                     justifyContent: 'center', 
                 }}
                 
                 />
                
            </View>
            <ScrollView style={Styles.scrollContainer}>

            </ScrollView>
        </SafeAreaView>
    );
}

export default ReceiptsPage;