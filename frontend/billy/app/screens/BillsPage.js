import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Styles from '/Users/arpitapandey/bill-splitting-and-receipt-archival-1/frontend/billy/app/styles.js';

function BillsPage(props) {
    const [selectedTab, setSelectedTab] = useState('owe'); // 'owe' or 'owed'
    const [sortOption, setSortOption] = useState('date'); // 'date', 'group', 'person'

    const sortBills = (bills, option) => {
        switch (option) {
          case 'date':
            return bills.sort((a, b) => new Date(b.date) - new Date(a.date));
          case 'group':
            return bills.sort((a, b) => a.name.localeCompare(b.name));
          case 'person':
            // Assuming you have a person field, replace with actual field
            return bills.sort((a, b) => a.person.localeCompare(b.person));
          default:
            return bills;
        }
      };

    return (
        <View style={Styles.container}>
            <View style={[Styles.receiptsWelcome, {height: 190}]}>
                <Text style={[Styles.heading1, {color:'white'},{left:25}, {top:35}]} >Bills</Text>
                <View style={Styles.tabs}>
                    <TouchableOpacity onPress={() => setSelectedTab('owe')} style={[Styles.tab, selectedTab === 'owe' && Styles.selectedTab]}>
                         <Text style={Styles.tabText}>bills you owe</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedTab('owed')} style={[Styles.tab, selectedTab === 'owed' && Styles.selectedTab]}>
                        <Text style={Styles.tabText}>bills owed to you</Text>
                    </TouchableOpacity>
                </View> 
                <View style={styles.tabs}>
                    <TouchableOpacity onPress={() => setSortOption('date')} style={[Styles.sortTab, sortOption === 'date' && styles.selectedTab]}>
                        <Text style={[Styles.sortTabText, sortOption === 'date' && styles.selectedTabText]}>date</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSortOption('group')} style={[Styles.sortTab, sortOption === 'group' && styles.selectedTab]}>
                        <Text style={[Styles.sortTabText, sortOption === 'group' && styles.selectedTabText]}>group</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSortOption('person')} style={[Styles.sortTab, sortOption === 'person' && styles.selectedTab]}>
                        <Text style={[Styles.sortTabText, sortOption === 'person' && styles.selectedTabText]}>person</Text>
                    </TouchableOpacity>
                </View>

            </View>
           



        </View>
    );
}

export default BillsPage;