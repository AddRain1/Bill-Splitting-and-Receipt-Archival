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
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../styles';
import COLORS from "../assets/colors";
import NavigationBar from '../assets/NavigationBar';
import { Octicons, Feather } from 'react-native-vector-icons';
import Draggable from '../assets/Draggable';

initialItemList = [
    {
        item_id: 1,
        item_name: "Driscoll’s Raspberries (12oz)",
        item_price: 5.94,
        index: 1,
        box: 0,
    },
    {
        item_id: 2,
        item_name: "3x Fuji Apples",
        item_price: 6.97,
        index: 2,
        box: 0,
    },
    {
        item_id: 3,
        item_name: "Chocolate Chip Cookies",
        item_price: 4.55,
        index: 3,
        box: 0,
    },
    {
        item_id: 4,
        item_name: "Ralph’s Purified Drinking Water",
        item_price: 5.24,
        index: 4,
        box: 0,
    },
    {
        item_id: 5,
        item_name: "Driscoll’s Raspberries (12oz)",
        item_price: 5.94,
        index: 5,
        box: 1,
    },
    {
        item_id: 6,
        item_name: "3x Fuji Apples",
        item_price: 6.97,
        index: 6,
        box: 1,
    },
    {
        item_id: 7,
        item_name: "Chocolate Chip Cookies",
        item_price: 4.55,
        index: 7,
        box: 1,
    },
    {
        item_id: 8,
        item_name: "Ralph’s Purified Drinking Water",
        item_price: 5.24,
        index: 8,
        box: 1,
    },
];

boxStarts = [0, 0];

function ReceiptEdit(props) {
    const [font] = useFonts({
        'SplineSansMono': require('./../assets/fonts/SplineSansMono-Regular.ttf'), 
    });
    const navigation = useNavigation();

    const [scrollEnabled, setScrollEnabled] = useState(true);
    const setDragging = (isDragging) => { setScrollEnabled(!isDragging);};

    // const [boxStartsSet, setBoxStartsSet] = useState(false);

    // useEffect(() => {
    //     if (boxStarts[0] !== 0 && boxStarts[1] !== 0) {
    //         setBoxStartsSet(true);
    //     }
    // }, [boxStarts]);

    const [itemList, setItemList] = useState(initialItemList);
    const boxCounts = [4, 4];

    const calcBox = (index) => {
        box = 0;
        indexCount = 0;
        for(i = 0; i < boxCounts.length; i++) {
            indexCount += boxCounts[i];
            if (index <= indexCount) {
                box = i;
                break;
            }
        }
        return box;
    }


    const handleIndexChange = (index, newIndex) => {
        console.log("Attempting to switch item at index " + index + " to index " + newIndex);
        // const oldBox = calcBox(index);
        // const newBox = calcBox(newIndex);

        // const updatedItemList = [...itemList];
        // const itemToMove = updatedItemList.find(item => item.index === index);

        // if (!itemToMove) return;

        // if (oldBox === newBox) {
        //     updatedItemList.forEach(item => {
        //         if (item.index !== index) {
        //             if (index < newIndex && item.index > index && item.index <= newIndex) {
        //                 item.index -= 1;
        //             } else if (index > newIndex && item.index < index && item.index >= newIndex) {
        //                 item.index += 1;
        //             }
        //         }
        //     });
        // } else {
        //     boxCounts[oldBox] -= 1;
        //     boxCounts[newBox] += 1;

        //     updatedItemList.forEach(item => {
        //         if (item.index !== index) {
        //             if (item.box === oldBox && item.index > itemToMove.index) {
        //                 item.index -= 1;
        //             } else if (item.box === newBox && item.index >= newIndex) {
        //                 item.index += 1;
        //             }
        //         }
        //     });

        //     itemToMove.box = newBox;
        // }

        // itemToMove.index = newIndex;
        // setItemList(updatedItemList);


        const updatedItemList = [...itemList];

        const itemToMove = updatedItemList.find(item => item.index === index);

        if (!itemToMove) return;

        updatedItemList.forEach(item => {
            // console.log("Currently examining " + item.item_name + " at " + item.index);
            if (item.index !== index) {
                if (index < newIndex && item.index > index && item.index <= newIndex) {
                    item.index -= 1;
                } else if (index > newIndex && item.index < index && item.index >= newIndex) {
                    item.index += 1;
                }
                // console.log(item.item_name + " had position updated to " + item.index);
            }
        });

        itemToMove.index = newIndex;
        setItemList(updatedItemList);

        // itemList.forEach(item => {
        //     console.log(item.item_name + ": " + item.index);
        // });
    };
    
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
                scrollEnabled={scrollEnabled}
            >
                <SafeAreaView style = {[styles.container2, {width: 380}]}>

                    <SafeAreaView style = {[styles.container2, { width: 380, flexDirection: 'row', alignItems: 'center', marginBottom: 10}]}>
                        <Text style = {[styles.caption, {fontSize: 14,}]}> Title: </Text>
                        <Text style = {[styles.editInput, {}]}> Ralph’s Fresh Fare </Text>
                    </SafeAreaView>
                    <SafeAreaView style = {[styles.container2, { width: 380, flexDirection: 'row', alignItems: 'center', marginBottom: 10}]}>
                        <Text style = {[styles.caption, {fontSize: 14,}]}> Date: </Text>
                        <Text style = {[styles.editInput, {}]}> 06/21/2024 </Text>
                    </SafeAreaView>
                    <SafeAreaView style = {[styles.container2, { width: 380, flexDirection: 'row', alignItems: 'center', marginBottom: 10}]}>
                        <Text style = {[styles.caption, {fontSize: 14,}]}> Subtotal ($): </Text>
                        <Text style = {[styles.editInput, {}]}> 40.66 </Text>
                    </SafeAreaView>
                    <SafeAreaView style = {[styles.container2, { width: 380, flexDirection: 'row', alignItems: 'center', marginBottom: 10}]}>
                        <Text style = {[styles.caption, {fontSize: 14,}]}> Tip: </Text>
                        <Text style = {[styles.editInput, {}]}> 2.00 </Text>
                    </SafeAreaView>
                    <SafeAreaView style = {[styles.grayDivider, {width:430, marginTop:10}]} />

                    <Text style = {[styles.caption, {fontSize: 14, marginBottom: 5}]}> You: </Text>
                    <SafeAreaView style = {[styles.container3, {backgroundColor: COLORS.softGray}]}>
                        <Text style = {[styles.body1, {fontSize: 18, color: COLORS.black, marginTop: 25, marginBottom: 10, left: 10}]}> Taylor </Text>
                    </SafeAreaView>
                    <SafeAreaView 
                        style = {[styles.container3, {height: 40 * 4 + 10}]} 
                        onLayout={e => {
                            boxStarts[0] = e.nativeEvent.layout.y + 10;
                        }}
                    > 
                    </SafeAreaView>

                    <Text style = {[styles.caption, {fontSize: 14, marginBottom: 5, marginTop: 25,}]}> Others: </Text>
                    <SafeAreaView style = {[styles.container3, {backgroundColor: COLORS.softGray, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
                        <Text style = {[styles.body1, {fontSize: 18, color: COLORS.black, marginTop: 25, marginBottom: 10, left: 10}]}> Jordan </Text>
                        <Octicons name="clock"  size={24} color={COLORS.yellow} style = {{marginRight: 15, marginTop: 25, marginBottom: 10}}/>
                    </SafeAreaView>
                    <SafeAreaView 
                        style = {[styles.container3, {height: 40 * 4 + 10}]}
                        onLayout={e => {
                            boxStarts[1] = e.nativeEvent.layout.y + 10;
                        }}
                    > 
                    </SafeAreaView>

                    {itemList.map((item, i) => {
                    return (
                        <Draggable
                            key={item.item_id}
                            item_name={item.item_name}
                            item_price={item.item_price}
                            onDraggingChange={setDragging}
                            index={i}
                            itemList={itemList}
                            boxStarts={boxStarts}
                            boxCounts={boxCounts}
                            onIndexChange={handleIndexChange}
                        />
                    );
                    })}
                    {/* {boxStartsSet && itemList.map((item, i) => (
                        <Draggable
                            key={item.item_id}
                            item_name={item.item_name}
                            item_price={item.item_price}
                            onDraggingChange={setDragging}
                            index={i}
                            itemList={itemList}
                            boxStarts={boxStarts}
                            onIndexChange={handleIndexChange}
                        />
                    ))} */}
                </SafeAreaView>

            </ScrollView>
        </SafeAreaView>
    );
}

export default ReceiptEdit;