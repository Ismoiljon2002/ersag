import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Button, Alert } from 'react-native';
import TopBar from '../components/TopBar'; // Import TopBar
import OrderModal from '../components/OrdersModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getOrders, saveOrders, clearOrders } from '../storage'; // Import storage functions
import { Icon } from 'react-native-elements';

const OrdersScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const storedOrders = await getOrders();
            setOrders(storedOrders);
        };

        fetchOrders();
    }, []);

    const handleAddOrder = () => {
        setSelectedOrder(null); // Ensure we're not editing when adding a new order
        setModalVisible(true);
    };

    const handleEditOrder = (order) => {
        setSelectedOrder(order);
        setModalVisible(true);
    };

    const handleDeleteOrder = (index) => {
        Alert.alert(
            'Delete Order',
            'Are you sure you want to delete this order?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => deleteOrder(index) }
            ]
        );
    };

    const deleteOrder = async (index) => {
        const updatedOrders = orders.filter((_, i) => i !== index);
        setOrders(updatedOrders);
        await saveOrders(updatedOrders);
    };

    const handleCloseModal = async (newOrder) => {
        setModalVisible(false);
        if (newOrder) {
            const updatedOrders = selectedOrder
                ? orders.map(order => (order === selectedOrder ? newOrder : order))
                : [...orders, newOrder];
            setOrders(updatedOrders);
            await saveOrders(updatedOrders);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TopBar title="Buyurtmalarim" onAddPress={handleAddOrder} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <FlatList
                    data={orders}
                    renderItem={({ item, index }) => (
                        <View style={styles.orderItem}>
                            <TouchableOpacity onPress={() => handleEditOrder(item)}>
                                <Text style={styles.orderTitle}> {index + 1}-buyurtma {item.item}</Text>
                                <Text style={styles.orderDate}>
                                    Buyurtma sanasi: {item.items[0].orderDate.split('T')[0]}
                                </Text>
                                <FlatList
                                    data={item.items}
                                    renderItem={({ item, index }) => (
                                        <View style={styles.itemContainer}>
                                            <Text style={styles.text}> {index + 1}. {item.item} - {item.price} so'm</Text>
                                            {item.customer && <Text style={styles.text}>Xaridorning ismi: {item.customer}</Text>}
                                        </View>
                                    )}
                                    keyExtractor={(item, index) => index.toString()} 
                                />
                            </TouchableOpacity>
                            <Button title="O'chirish" color="red" onPress={() => handleDeleteOrder(index)} />
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </ScrollView>
            <OrderModal visible={modalVisible} onClose={handleCloseModal} order={selectedOrder} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 18
    },
    container: { flex: 1 },
    scrollContainer: {
        padding: 10
    },
    orderItem: {
        padding: 15,
        marginBottom: 10,
        marginTop: 5,
        backgroundColor: '#fff'

    },
    orderTitle: { fontWeight: 'bold' },
    itemContainer: {
        marginBottom: 10,
        padding: 10,
        borderBottomWidth: 1

    },
    orderDate: {
        fontStyle: 'italic',
        fontSize: 16,
        color: 'gray',
        marginBottom: 10,
    },
});

export default OrdersScreen;
