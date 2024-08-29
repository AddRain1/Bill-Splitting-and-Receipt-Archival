import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from './colors';
import User from './User';

const SummaryContainer = () => {
    const users = [
        { name: 'Alex S.', amount: 123.25, bills: 3 },
        { name: 'Jill M.', amount: 82.87, bills: 5},
        { name: 'Grace X.', amount: 14.44, bills: 2},
    ];

    const totalAmount = users.reduce((total, user) => total + user.amount, 0);
    const totalBills = users.reduce((total, user) => total + user.bills, 0);

    return (
        <View style={styles.container}>

            <View style={styles.usersContainer}>
                {users.map((user, index) => (
                    <User
                        key={index}
                        name={user.name}
                        amount={user.amount}
                        bills={user.bills}
                    />
                ))}
            </View>
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total</Text>
                <Text style={styles.totalAmount}>{`+${totalAmount.toFixed(2)}`}</Text>
                <Text style={styles.totalBills}>{`${totalBills} bills`}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F0F4F8',
        borderRadius: 10,
        padding: 20,
        margin: 10,
    },
    heading: {
        fontSize: 18,
        color: 'black',
        fontFamily: 'SplineSansMono',
        marginBottom: 20,
    },
    usersContainer: {
        marginBottom: 10,
    },
    totalContainer: {
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    totalText: {
        fontSize: 14,
        color: 'black',
        fontFamily: 'SplineSansMono',
    },
    totalAmount: {
        fontSize: 14,
        color: '#00C896',
        fontFamily: 'SplineSansMono',
    },
    totalBills: {
        fontSize: 14,
        color: '#A0AABF',
        fontFamily: 'SplineSansMono',
    },
});

export default SummaryContainer;
