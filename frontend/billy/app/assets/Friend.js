import React from 'react';
import PropTypes from 'prop-types';
import COLORS from './colors';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const Friend = ({ name, username, email, onManagePress }) => {
  return (
    <View style={styles.groupContainer}>
      <View >
        <View style={styles.nameUsername}>
        <Text style={styles.groupName}>{name}</Text>
        <Text style={styles.username}>({username})</Text>
        </View>
        <Text style={styles.groupMembers}>{email}</Text>
      </View>

      <TouchableOpacity style={styles.manageButton} onPress={onManagePress}>
        <Text style={styles.manageButtonText}>add</Text>
      </TouchableOpacity>
    </View>
  );
};

Friend.propTypes = {
  name: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  onManagePress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  groupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F4f8',
    borderRadius: 8,
    padding: 25,
    marginBottom: 10,
    width: 380,
  },
  nameUsername:{
    flexDirection:'row'

  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'SplineSansMono',
  },
  username: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
    fontFamily: 'SplineSansMono',
  },
  groupMembers: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'SplineSansMono',
  },
  manageButton: {
    backgroundColor: COLORS.lightGray,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  manageButtonText: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'SplineSansMono',
  },
});

export default Friend;