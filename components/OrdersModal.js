import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, Dimensions, ScrollView, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';
import moment from 'moment';

const { height: screenHeight } = Dimensions.get('window');

const OrderModal = ({ visible, onClose, order }) => {
    const [orderDate, setOrderDate] = useState(order ? new Date(order.orderDate) : new Date());
    const [items, setItems] = useState(order ? order.items : [{ item: '', price: '', isGift: false, customer: '' }]);
    const [discountPercent, setDiscountPercent] = useState(order ? order.discountPercent || '0' : '0');
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (order) {
            setOrderDate(new Date(order.orderDate) || new Date());
            setItems(order.items || [{ item: '', price: '', isGift: false, customer: '' }]);
            setDiscountPercent(order.discountPercent || '0');
        } else {
            setOrderDate(new Date());
            setItems([{ item: '', price: '', isGift: false, customer: '' }]);
            setDiscountPercent('0');
        }
    }, [order]);

    const addItem = () => {
        const isValid = items.every(item => item.item && item.price && item.customer);
        if (isValid) {
            setItems([...items, { item: '', price: '', isGift: false, customer: '' }]);
        } else {
            Alert.alert('Incomplete Item', "Iltimos, avvalgi maxsulotni to'liq kiriting");
        }
    };

    const handleSave = () => {
        // Validate that all items have all required fields
        const isValid = items.every(item => item.item && item.price && item.customer);
        if (!isValid) {
            Alert.alert('Incomplete Order', "Iltimos, barcha maxsulotlarni to'liq kiriting");
            return;
        }

        const generateUniqueId = () => '_' + Math.random().toString(36).substr(2, 9);
        const newOrder = { ...order, id: order?.id || generateUniqueId(), orderDate: moment(orderDate).format('YYYY-MM-DD'), discountPercent, items };
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
                        <Text style={styles.headerText}>Sanani tanlang:</Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                            <Text style={styles.dateText}>{moment(orderDate).format('MMMM D, YYYY')}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={orderDate}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (selectedDate) {
                                        setOrderDate(selectedDate);
                                    }
                                }}
                            />
                        )}
                        <TextInput
                            placeholder="Chegirma (0-100) %"
                            keyboardType="numeric"
                            value={discountPercent}
                            onChangeText={(text) => setDiscountPercent(text)}
                            style={styles.input}
                        />
                        {items.map((item, index) => (
                            <View key={index} style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="Maxsulot nomi"
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
                                    selectedValue={item.isGift}
                                    onValueChange={(value) => {
                                        const newItems = [...items];
                                        newItems[index].isGift = value;
                                        setItems(newItems);
                                    }}
                                >
                                    <Picker.Item label="Sovg'a" value={true} />
                                    <Picker.Item label="Sotib olindi" value={false} />
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
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity onPress={() => deleteItem(index)} style={styles.deleteButton}>
                                        <Icon name="trash" type='entypo' size={24} color="white" />
                                        <Text style={styles.buttonText}>O'chirish</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={addItem} style={styles.addButton}>
                                        <Icon name="cart-plus" type='material-community' size={24} color="white" />
                                        <Text style={styles.buttonText}>Maxsulot qo'shish</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                            <Icon name="save" size={24} color="white" />
                            <Text style={styles.buttonText}>Saqlash</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onClose(null)} style={styles.closeButton}>
                            <Icon name="exit-to-app" size={24} color="white" />
                            <Text style={styles.buttonText}>Yopish</Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
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
    dateButton: {
        borderBottomWidth: 1,
        padding: 10,
        marginBottom: 10,
    },
    dateText: {
        fontSize: 18,
    },
    inputWrapper: {
        gap: 7,
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 5,
        fontSize: 18,
        padding: 7,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'red',
        padding: 10,
        paddingRight: 25,
        borderRadius: 5,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'orange',
        padding: 10,
        borderRadius: 5,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
    },
    closeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 16,
    },
});

export default OrderModal;
