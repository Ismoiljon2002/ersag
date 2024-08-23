import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const TopBar = ({ title, onAddPress }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {onAddPress && (
                <Icon
                    name="add"
                    color="white"
                    onPress={onAddPress}
                    containerStyle={styles.icon}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FF6F00', // Bright orange color
        padding: 20,
    },
    title: {
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
    },
    icon: {
        marginRight: 10,
    },
});

export default TopBar;
