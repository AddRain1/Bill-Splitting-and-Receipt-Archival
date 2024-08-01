
import React, { useRef, useState } from 'react'; 
import { PanResponder, Animated, Text } from 'react-native'; 
import styles from '../styles';
import COLORS from "../assets/colors";
import { Feather } from 'react-native-vector-icons';
  
const Draggable = ({ item_name, item_price, setDragging, initialIndex, boxStarts }) => { 

    const position = useRef(new Animated.ValueXY()).current; 
    const [index, setIndex] = useState(initialIndex);

    function calcIndex() {
        temp = Math.floor((position.y._value - boxStarts[0]) / 40) + 1;
        if (temp < 1) {temp = 1;}
        if (temp > 4) {temp = 4;}
        return temp;
    }

    const panResponder = useRef( 
        PanResponder.create({ 
            onStartShouldSetPanResponder: () => true, 
            onMoveShouldSetPanResponder: () => true, 
            onPanResponderGrant: () => { 
                setDragging(true); 
                position.setOffset({
                    x: position.x._value,
                    y: position.y._value
                });
                position.setValue({ x: 0, y: 0 });
            }, 
            onPanResponderMove: Animated.event( 
                [ 
                    null, 
                    { 
                        dy: position.y,
                    }, 
                ], 
                { useNativeDriver: false } 
            ), 
            onPanResponderRelease: () => { 
                setDragging(false); 
                position.flattenOffset();
                const newIndex = calcIndex();
                setIndex(newIndex);
                Animated.spring(position, {
                    toValue: { x: 0, y: boxStarts[0] + 40 * (newIndex-1) },
                    useNativeDriver: false
                }).start();
            }, 
        }) 
    ).current; 
  
    return ( 
        <Animated.View 
            style={[ styles.listRow, 
                { 
                    transform: position.getTranslateTransform(),  
                    backgroundColor: COLORS.softWhite,
                    position: 'absolute',
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