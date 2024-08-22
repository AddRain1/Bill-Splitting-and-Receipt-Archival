import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Receipt = ({ storeName, amount, date }) => {
    return (
        <View style={styles.receiptContainer}>
            <View style={styles.storeContainer}>
                <Text style={styles.storeName}>{storeName}</Text>
                <Text style={styles.amount}>{`$${amount}`}</Text>
            </View>
            <Text style={styles.date}>{date}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    receiptContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#F0F4F8',
        marginVertical: 5,
    },
    storeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '75%',
    },
    storeName: {
        fontSize: 14,
        color: '#2E3A59',
        fontFamily: 'SplineSansMono',
    },
    amount: {
        fontSize: 12,
        color: '#008080',
        fontFamily: 'SplineSansMono',
    },
    date: {
        fontSize: 12,
        color: '#A0AABF',
        fontFamily: 'SplineSansMono',
    },
});

export default Receipt;