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
import { SafeAreaView, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
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

initialBoxStarts = [0, 0];
boxCounts = [4, 4];

function ReceiptEdit(props) {
    const [font] = useFonts({
        'SplineSansMono': require('./../assets/fonts/SplineSansMono-Regular.ttf'), 
    });
    const navigation = useNavigation();

    const [scrollEnabled, setScrollEnabled] = useState(true);
    const setDragging = (isDragging) => { setScrollEnabled(!isDragging);};

    const [itemList, setItemList] = useState(initialItemList);
    const [boxStarts, setBoxStarts] = useState(initialBoxStarts);

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
        const oldBox = calcBox(index);
        const newBox = calcBox(newIndex);

        const updatedItemList = [...itemList];
        const itemToMove = updatedItemList.find(item => item.index === index);

        if (!itemToMove) return;

        if (oldBox === newBox) {
            for(i = 0; i < updatedItemList.length; i++) {
            // updatedItemList.forEach(item => {
                if (updatedItemList[i].index !== index) {
                    if (index < newIndex && updatedItemList[i].index > index && updatedItemList[i].index <= newIndex) {
                        updatedItemList[i].index -= 1;
                    } else if (index > newIndex && updatedItemList[i].index < index && updatedItemList[i].index >= newIndex) {
                        updatedItemList[i].index += 1;
                    }
                }
            // });
            }
        } else {
            boxCounts[oldBox] -= 1;
            boxCounts[newBox] += 1;

            for(i = 0; i < updatedItemList.length; i++) {
            // updatedItemList.forEach(item => {
                if (updatedItemList[i].index !== index) {
                    if (index < newIndex && updatedItemList[i].index > index && updatedItemList[i].index <= newIndex) {
                        updatedItemList[i].index -= 1;
                    } else if (index > newIndex && updatedItemList[i].index < index && updatedItemList[i].index >= newIndex) {
                        updatedItemList[i].index += 1;
                    }
                }
            // });
            }

            itemToMove.box = newBox;
        }

        itemToMove.index = newIndex;
        setItemList(updatedItemList);
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
                        <Text style = {[styles.caption, {fontSize: 14, }]}> Title: </Text>
                        <TextInput style = {[styles.editInput, {paddingLeft:10, paddingRight:10}]}>Ralph’s Fresh Fare</TextInput>
                    </SafeAreaView>
                    <SafeAreaView style = {[styles.container2, { width: 380, flexDirection: 'row', alignItems: 'center', marginBottom: 10}]}>
                        <Text style = {[styles.caption, {fontSize: 14,}]}> Date: </Text>
                        <TextInput style = {[styles.editInput, {paddingLeft:10, paddingRight:10}]}>06/21/2024</TextInput>
                    </SafeAreaView>
                    <SafeAreaView style = {[styles.container2, { width: 380, flexDirection: 'row', alignItems: 'center', marginBottom: 10}]}>
                        <Text style = {[styles.caption, {fontSize: 14,}]}> Subtotal ($): </Text>
                        <TextInput style = {[styles.editInput, {paddingLeft:10, paddingRight:10}]}>40.66</TextInput>
                    </SafeAreaView>
                    <SafeAreaView style = {[styles.container2, { width: 380, flexDirection: 'row', alignItems: 'center', marginBottom: 10}]}>
                        <Text style = {[styles.caption, {fontSize: 14,}]}> Tip: </Text>
                        <TextInput style = {[styles.editInput, {paddingLeft:10, paddingRight:10}]}>2.00</TextInput>
                    </SafeAreaView>
                    <SafeAreaView style = {[styles.grayDivider, {width:430, marginTop:10}]} />

                    <Text style = {[styles.caption, {fontSize: 14, marginBottom: 5}]}> You: </Text>
                    <SafeAreaView style = {[styles.container3, {backgroundColor: COLORS.softGray}]}>
                        <Text style = {[styles.body1, {fontSize: 18, color: COLORS.black, marginTop: 25, marginBottom: 10, left: 10}]}> Taylor </Text>
                    </SafeAreaView>
                    <SafeAreaView 
                        style = {[styles.container3, {height: 40 * boxCounts[0] + 10}]} 
                        onLayout={e => {
                            const newBoxStarts = [...boxStarts];
                            newBoxStarts[0] = e.nativeEvent.layout.y + 10;
                            setBoxStarts(newBoxStarts);
                        }}
                    > 
                    </SafeAreaView>

                    <SafeAreaView style = {[styles.container2, { width: 380, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0}]}>
                        <SafeAreaView style = {[styles.container2, { flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 25}]}>
                            <Text style = {[styles.caption, {fontSize: 14, }]}> Others: </Text>
                            <Text style = {[styles.editInput, {}]}> 1 </Text>
                        </SafeAreaView>
                        <TouchableOpacity><Octicons name="plus-circle"  size={24} color={COLORS.black} style = {{marginTop: 20, marginRight:8}}/></TouchableOpacity>
                    </SafeAreaView>
                    <SafeAreaView style = {[styles.container3, {backgroundColor: COLORS.softGray, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
                        <Text style = {[styles.body1, {fontSize: 18, color: COLORS.black, marginTop: 25, marginBottom: 10, left: 10}]}> Jordan </Text>
                        <SafeAreaView style = {[styles.container2, { flexDirection: 'row', alignItems: 'center', marginBottom:0}]}>
                            <Octicons name="clock"  size={24} color={COLORS.yellow} style = {{marginRight: 15, marginTop: 25, marginBottom: 10}}/>
                            <TouchableOpacity style = {{backgroundColor: COLORS.hoverGray, width: 40, justifyContent: 'center', alignItems: 'center',}}>
                                <Octicons name="x"  size={24} color={COLORS.red} style = {{ marginTop: 25, marginBottom: 10}}/>
                            </TouchableOpacity>
                        </SafeAreaView>
                    </SafeAreaView>
                    <SafeAreaView 
                        style = {[styles.container3, {height: 40 * boxCounts[1] + 10}]}
                        onLayout={e => {
                            const newBoxStarts = [...boxStarts];
                            newBoxStarts[1] = e.nativeEvent.layout.y + 10;
                            setBoxStarts(newBoxStarts);
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
                </SafeAreaView>

            </ScrollView>
        </SafeAreaView>
    );
}

export default ReceiptEdit;