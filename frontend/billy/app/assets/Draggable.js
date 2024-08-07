
import React, { useRef, useState, useEffect } from 'react'; 
import { PanResponder, Animated, Text } from 'react-native'; 
import styles from '../styles';
import COLORS from "../assets/colors";
import { Feather } from 'react-native-vector-icons';
  
const Draggable = ({ item_name, item_price, onDraggingChange, index, itemList, boxStarts, boxCounts, onIndexChange }) => { 

    const position = useRef(new Animated.ValueXY()).current; 
    const [dragging, setDragging] = useState(false);
    // const [index, setIndex] = useState(initialIndex);

    useEffect(() => {
        if (!isNaN(index)) {
            // console.log(item_name + " is indexed " + itemList[index].index + " and at " + (boxStarts[itemList[index].box] + 40 * (itemList[index].index - 1)));
            Animated.spring(position, {
                toValue: { x: 0, y: boxStarts[itemList[index].box] + 40 * (itemList[index].index - 1) },
                useNativeDriver: false
            }).start();
        }
    }, [itemList, boxStarts]);

    function calcIndex() {
        let box = 0;
        for(i = boxStarts.length-1; i >= 0; i--) {
            if (position.y._value > boxStarts[i]) {
                box = i;
                break;
            }
        }
        temp = Math.floor((position.y._value - boxStarts[box]) / 40) + 1;
        if (temp < 1) {temp = 1;}
        if (temp > boxCounts[box]) {temp = boxCounts[box];}
        for(i = 0; i < box; i++) {
            temp += boxCounts[i];
        }
        return temp;
    }

    const panResponder = useRef( 
        PanResponder.create({ 
            onStartShouldSetPanResponder: () => true, 
            onMoveShouldSetPanResponder: () => true, 
            onPanResponderGrant: () => { 
                setDragging(true); 
                onDraggingChange(true);
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
                onDraggingChange(false);
                position.flattenOffset();
                const newIndex = calcIndex();
                // console.log("This is item indexed " + index + " at position " + itemList[index].index);
                onIndexChange(itemList[index].index, newIndex);
                // setIndex(newIndex);
                // Animated.spring(position, {
                //     toValue: { x: 0, y: boxStarts[0] + 40 * (newIndex-1) },
                //     useNativeDriver: false
                // }).start();
            }, 
            // onPanResponderRelease: () => {
            //     setDragging(false);
            //     position.flattenOffset();
            //     const newIndex = calcIndex();
            //     if (newIndex !== index) {
            //         onIndexChange(index, newIndex);
            //         setIndex(newIndex);
            //     } else {
            //         Animated.spring(position, {
            //             toValue: { x: 0, y: boxStarts[0] + 40 * (index - 1) },
            //             useNativeDriver: false
            //         }).start();
            //     }
            // },
        }) 
    ).current; 
  
    return ( 
        <Animated.View 
            style={[ styles.listRow, 
                { 
                    transform: position.getTranslateTransform(),  
                    backgroundColor: COLORS.softWhite,
                    position: 'absolute',
                    // top: boxStarts[0] + 40 & (itemList[index].index - 1),
                    zIndex: dragging ? 1 : 0,
                    opacity: dragging ? 0.8 : 1, 
                }, 
            ]} 
            {...panResponder.panHandlers} 
        > 
            <Text style={[styles.editInput, {backgroundColor: COLORS.white, flex: 1}]} numberOfLines={1}> {item_name} </Text> 
            {/* <Text style={[styles.editInput, {backgroundColor: COLORS.white, marginLeft: 10, marginRight: 10,}]}> ${item_price} </Text>  */}
            <Text style={[styles.editInput, {backgroundColor: COLORS.white, marginLeft: 10, marginRight: 10,}]}> {itemList[index].index} </Text>
            <Feather name="move"  size={20} color={COLORS.gray} />
        </Animated.View> 
    ); 
}; 

export default Draggable;