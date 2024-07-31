
import React, { useRef, useState } from 'react'; 
import { PanResponder, Animated, Text } from 'react-native'; 
import styles from '../styles';
import COLORS from "../assets/colors";
import { Feather } from 'react-native-vector-icons';
  
const Draggable = ({ item_name, item_price, setDragging}) => { 

    const position = useRef(new Animated.ValueXY()).current; 
  
    const panResponder = useRef( 
        PanResponder.create({ 
            onStartShouldSetPanResponder: () => true, 
            onMoveShouldSetPanResponder: () => true, 
            onPanResponderGrant: () => { setDragging(true); }, 
            onPanResponderMove: Animated.event( 
                [ 
                    null, 
                    { 
                        dy: position.y, 
                    }, 
                ], 
                { useNativeDriver: false } 
            ), 
            onPanResponderRelease: () => { setDragging(false); }, 
        }) 
    ).current; 
  
    return ( 
        <Animated.View 
            style={[ styles.listRow, 
                { 
                    transform: position.getTranslateTransform(),  
                    backgroundColor: COLORS.softWhite,
                }, 
            ]} 
            {...panResponder.panHandlers} 
        > 
            <Text style={[styles.editInput, {backgroundColor: COLORS.white, flex: 1}]} numberOfLines={1}> {item_name} </Text> 
            <Text style={[styles.editInput, {backgroundColor: COLORS.white, marginLeft: 10, marginRight: 10,}]}> ${item_price} </Text> 
            <Feather name="move"  size={20} color={COLORS.gray} />
        </Animated.View> 
    ); 
}; 

export default Draggable;