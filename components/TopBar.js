import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const TopBar = ({ title, onBackPress, onFilterPress }) => {
    return (
        <View style={styles.container}>
            {onBackPress && (
                <TouchableOpacity onPress={onBackPress}>
                    <Icon name="arrow-back" color="white" size={24} />
                </TouchableOpacity>
            )}
            <Text style={styles.title}>{title}</Text>
            {onFilterPress && (
                <TouchableOpacity onPress={onFilterPress}>
                    <Icon name="filter" color="white" size={24} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FF6F00',
    },
    title: {
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
    },
});

export default TopBar;
