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
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../styles';
import COLORS from "../assets/colors";
import NavigationBar from '../assets/NavigationBar';
import { Octicons, Feather } from 'react-native-vector-icons';

itemList = [
    {
        item_id: 1,
        item_name: "Driscoll’s Raspberries (12oz)",
        item_price: 5.94
    },
    {
        item_id: 2,
        item_name: "3x Fuji Apples",
        item_price: 6.97
    },
    {
        item_id: 3,
        item_name: "Chocolate Chip Cookies",
        item_price: 4.55
    },
    {
        item_id: 4,
        item_name: "Ralph’s Purified Drinking Water",
        item_price: 5.24
    },
  ];

function ReceiptEdit(props) {
    const [font] = useFonts({
        'SplineSansMono': require('./../assets/fonts/SplineSansMono-Regular.ttf'), 
    });
    const navigation = useNavigation();
    
    return (
        <SafeAreaView style = {styles.container}>
            <SafeAreaView style = {styles.topBar}>
                <SafeAreaView style = {[styles.container2, {height: 50}]}> 
                </SafeAreaView>
                <Text style = {[styles.caption2, {left: 25}]}> 06/21/2024 </Text>
                <SafeAreaView style = {[styles.container2, {left: 25, width: 380, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
                    <Text style = {[styles.heading1, {color: COLORS.softWhite}]}> Ralph's Fresh Fare </Text>
                    <Octicons name="clock"  size={32} color={COLORS.yellow} />
                </SafeAreaView>
            </SafeAreaView>
            <SafeAreaView style = {styles.subBar}>
                <TouchableOpacity style = {[styles.subBarButton, {left: 30}]} onPress={() => navigation.navigate('ReceiptView')}>
                    <Octicons name="arrow-left"  size={25} color={COLORS.gray} />
                    <Text style = {[styles.caption, {color: COLORS.gray}]}> cancel </Text>
                </TouchableOpacity>
                <TouchableOpacity style = {[styles.subBarButton, {left: 250}]} onPress={() => navigation.navigate('ReceiptView')}>
                    <Feather name="save"  size={25} color={COLORS.gray} />
                    <Text style = {[styles.caption, {color: COLORS.gray}]}> save </Text>
                </TouchableOpacity>
            </SafeAreaView>
            <ScrollView 
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator = {false}
            >
                <SafeAreaView style = {[styles.container2, {width: 380}]}>

                    <Text style = {[styles.caption, {fontSize: 14, marginBottom: 5}]}> Title: </Text>
                    <Text style = {[styles.caption, {fontSize: 14, marginBottom: 5}]}> Date: </Text>
                    <Text style = {[styles.caption, {fontSize: 14, marginBottom: 5}]}> Subtotal ($): </Text>
                    <Text style = {[styles.caption, {fontSize: 14, marginBottom: 5}]}> Tip: </Text>

                    <Text style = {[styles.caption, {fontSize: 14, marginBottom: 5}]}> You: </Text>
                    <SafeAreaView style = {[styles.container3, {backgroundColor: COLORS.softGray}]}>
                        <Text style = {[styles.body1, {fontSize: 18, color: COLORS.black, marginTop: 25, marginBottom: 10, left: 10}]}> Taylor </Text>
                    </SafeAreaView>
                    <SafeAreaView style = {styles.container3}> 

                    </SafeAreaView>

                    <Text style = {[styles.caption, {fontSize: 14, marginBottom: 5}]}> Others: </Text>
                    <SafeAreaView style = {[styles.container3, {backgroundColor: COLORS.softGray, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
                        <Text style = {[styles.body1, {fontSize: 18, color: COLORS.black, marginTop: 25, marginBottom: 10, left: 10}]}> Jordan </Text>
                        <Octicons name="clock"  size={24} color={COLORS.yellow} style = {{marginRight: 15, marginTop: 25, marginBottom: 10}}/>
                    </SafeAreaView>

                </SafeAreaView>

            </ScrollView>
        </SafeAreaView>
    );
}

export default ReceiptEdit;