import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, Dimensions, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from 'react-native-ui-datepicker';

const { height: screenHeight } = Dimensions.get('window'); // Get screen height


const OrderModal = ({ visible, onClose, order }) => {
    const [orderDate, setOrderDate] = useState(order ? order.orderDate : new Date().toISOString().split('T')[0]); // Default to today
    const [items, setItems] = useState(order ? order.items : [{ item: '', price: '', orderStatus: 'gift', customer: '', orderDate }]);

    useEffect(() => {
        if (order) {
            setItems(order.items || [{ item: '', price: '', orderStatus: 'gift', customer: '', orderDate }]);
        }
    }, [order]);

    const addItem = () => {
        const isValid = items.every(item => item.item && item.price);
        if (isValid) {
            setItems([...items, { item: '', price: '', orderStatus: 'gift', customer: '', orderDate }]);
        } else {
            Alert.alert('Incomplete Item', "Iltimos, avvalgi maxsulotni to'liq kiriting");
        }
    };

    const handleSave = () => {
        const newOrder = { ...order, items };
        onClose(newOrder); // Pass the new or edited order back to the parent component
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
            transparent={true} // Make sure the background is transparent
            onRequestClose={() => onClose(null)}
        >
            <View style={styles.overlay}>
                <SafeAreaView style={styles.modalContainer}>
                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>Buyurtma sanasini tanlang:</Text>
                        <DateTimePicker
                            mode="single"
                            date={orderDate}
                            onChange={(params) => setOrderDate(params.date)}
                        />
                        {items.map((item, index) => (
                            <View key={index} style={styles.inputWrapper} >
                                <TextInput
                                    placeholder="Mahsulot"
                                    value={item.item}
                                    onChangeText={(text) => {
                                        const newItems = [...items];
                                        newItems[index].item = text;
                                        setItems(newItems);
                                    }}
                                    style={styles.input}
                                />
                                <TextInput
                                    placeholder="Narxi"
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
                                    selectedValue={item.orderStatus}
                                    onValueChange={(value) => {
                                        const newItems = [...items];
                                        newItems[index].orderStatus = value;
                                        setItems(newItems);
                                    }}
                                >
                                    <Picker.Item label="Sovg'a" value="gift" />
                                    <Picker.Item label="Sotib olindi" value="bought" />
                                </Picker>
                                <TextInput
                                    placeholder="Xaridor ismi"
                                    value={item.customer}
                                    onChangeText={(text) => {
                                        const newItems = [...items];
                                        newItems[index].customer = text;
                                        setItems(newItems);
                                    }}
                                    style={styles.input}
                                />
                                <Button title="O'chirish" color="red" onPress={() => deleteItem(index)} style={styles.button} />
                                {index === items.length - 1 && (
                                    <Button title="Maxsulot qo'shish" onPress={addItem} style={styles.button} />
                                )}
                            </View>
                        ))}
                        <Button title="Buyurtmani saqlash" onPress={handleSave} style={styles.button} />
                        <Button title="Yopish" onPress={() => onClose(null)} style={styles.button} />
                    </ScrollView>
                </SafeAreaView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end', // Align modal to the bottom of the screen
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Add a semi-transparent background
    },
    inputWrapper: {
        gap: 10,
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        gap: 10,
        minHeight: screenHeight * 0.5, // Ensure some minimum height
    },
    itemContainer: { marginBottom: 20 },
    input: {
        borderBottomWidth: 1,
        marginBottom: 5,
        fontSize: 18,
        padding: 7
    },

});

export default OrderModal;
