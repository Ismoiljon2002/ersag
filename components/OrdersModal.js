// OrderModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, Dimensions, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from 'react-native-ui-datepicker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing icons

const { height: screenHeight } = Dimensions.get('window'); // Get screen height

const OrderModal = ({ visible, onClose, order }) => {
    const [orderDate, setOrderDate] = useState(order ? order.orderDate : new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState(order ? order.items : [{ item: '', price: '', isGift: false, customer: '' }]);
    const [discountPercent, setDiscountPercent] = useState(order ? order.discountPercent || '0' : '0');

    useEffect(() => {
        if (order) {
            setOrderDate(order.orderDate || new Date().toISOString().split('T')[0]);
            setItems(order.items || [{ item: '', price: '', isGift: false, customer: '' }]);
            setDiscountPercent(order.discountPercent || '0');
        } else {
            setOrderDate(new Date().toISOString().split('T')[0]);
            setItems([{ item: '', price: '', isGift: false, customer: '' }]);
            setDiscountPercent('0');
        }
    }, [order]);

    const addItem = () => {
        const isValid = items.every(item => item.item && item.price);
        if (isValid) {
            setItems([...items, { item: '', price: '', isGift: false, customer: '' }]);
        } else {
            Alert.alert('Incomplete Item', "Please complete the previous item.");
        }
    };

    const handleSave = () => {
        const generateUniqueId = () => '_' + Math.random().toString(36).substr(2, 9);
        const newOrder = { ...order, id: order?.id || generateUniqueId(), orderDate, discountPercent, items };
        onClose(newOrder);
    };

    const deleteItem = (index) => {
        if (items.length > 1) {
            const updatedItems = items.filter((_, i) => i !== index);
            setItems(updatedItems);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => onClose(null)}
        >
            <View style={styles.overlay}>
                <SafeAreaView style={styles.modalContainer}>
                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <Text style={styles.headerText}>Select Order Date:</Text>
                        <DateTimePicker
                            mode="single"
                            date={orderDate}
                            onChange={(params) => setOrderDate(params.date)}
                        />
                        {items.map((item, index) => (
                            <View key={index} style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="Product"
                                    value={item.item}
                                    onChangeText={(text) => {
                                        const newItems = [...items];
                                        newItems[index].item = text;
                                        setItems(newItems);
                                    }}
                                    style={styles.input}
                                />
                                <TextInput
                                    placeholder="Price"
                                    keyboardType="numeric"
                                    value={item.price}
                                    onChangeText={(text) => {
                                        const newItems = [...items];
                                        newItems[index].price = text;
                                        setItems(newItems);
                                    }}
                                    style={styles.input}
                                />
                                <Picker
                                    selectedValue={item.isGift}
                                    onValueChange={(value) => {
                                        const newItems = [...items];
                                        newItems[index].isGift = value;
                                        setItems(newItems);
                                    }}
                                >
                                    <Picker.Item label="Gift" value={true} />
                                    <Picker.Item label="Purchased" value={false} />
                                </Picker>
                                <TextInput
                                    placeholder="Customer Name"
                                    value={item.customer}
                                    onChangeText={(text) => {
                                        const newItems = [...items];
                                        newItems[index].customer = text;
                                        setItems(newItems);
                                    }}
                                    style={styles.input}
                                />
                                <TouchableOpacity onPress={() => deleteItem(index)} style={styles.deleteButton}>
                                    <Icon name="delete" size={24} color="white" />
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                                {index === items.length - 1 && (
                                    <TouchableOpacity onPress={addItem} style={styles.addButton}>
                                        <Icon name="add-circle" size={24} color="white" />
                                        <Text style={styles.buttonText}>Add Product</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                        <TextInput
                            placeholder="Discount Percent (0-100)"
                            keyboardType="numeric"
                            value={discountPercent}
                            onChangeText={(text) => setDiscountPercent(text)}
                            style={styles.input}
                        />
                        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                            <Icon name="save" size={24} color="white" />
                            <Text style={styles.buttonText}>Save Order</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onClose(null)} style={styles.closeButton}>
                            <Icon name="exit-to-app" size={24} color="white" />
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        gap: 10,
        minHeight: screenHeight * 0.5,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inputWrapper: {
        gap: 10,
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 5,
        fontSize: 18,
        padding: 7,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'orange',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    closeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
    },
    buttonText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 16,
    },
});

export default OrderModal;
