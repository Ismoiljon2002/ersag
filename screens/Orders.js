import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import TopBar from '../components/TopBar';
import OrderModal from '../components/OrdersModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getOrders, saveOrders } from '../storage';
import { formatNumber } from '../helpers/formatNumber';

const OrdersScreen = ({ navigation }) => {
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
        setSelectedOrder(null);
        setModalVisible(true);
    };

    const handleEditOrder = (order) => {
        setSelectedOrder(order);
        setModalVisible(true);
    };

    const handleDeleteOrder = (id) => {
        Alert.alert(
            'Delete Order',
            'Are you sure you want to delete this order?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: () => deleteOrder(id) }
            ]
        );
    };

    const deleteOrder = async (id) => {
        const updatedOrders = orders.filter((order) => order.id !== id);
        setOrders(updatedOrders);
        await saveOrders(updatedOrders);
    };

    const handleCloseModal = async (newOrder) => {
        setModalVisible(false);
        if (newOrder) {
            const updatedOrders = selectedOrder
                ? orders.map(order => (order.id === selectedOrder.id ? newOrder : order))
                : [...orders, newOrder];
            setOrders(updatedOrders);
            await saveOrders(updatedOrders);
        }
    };

    // Sort orders by date descending to ensure newest is at the top
    const sortedOrders = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    const formatOrderDate = (date) => {
        if (!date) return 'Unknown Date';
        const parsedDate = new Date(date);
        return parsedDate.toISOString().split('T')[0];
    };

    return (
        <SafeAreaView style={styles.container}>
            <TopBar
                title="Buyurtmalarim"
                onAddPress={handleAddOrder}
                onFilterPress={() => navigation.navigate('MonthSelection')}
            />
            <FlatList
                data={sortedOrders}
                renderItem={({ item, index }) => (
                    <View style={styles.orderItem}>
                        <TouchableOpacity onPress={() => handleEditOrder(item)}>
                            <View style={styles.orderHeader}>
                                <Icon name="bookmark" color="#000" />
                                <Text style={styles.orderTitle}>{formatNumber(sortedOrders.length - index)}-buyurtma</Text>
                            </View>
                            <Text style={styles.orderDate}>
                                Buyurtma sanasi: {formatOrderDate(item.orderDate)}
                            </Text>
                            <FlatList
                                data={item.items}
                                renderItem={({ item, index }) => (
                                    <View style={styles.itemContainer}>
                                        <View style={styles.itemContent}>
                                            <Text style={styles.text}>
                                                {item.isGift && <Icon name="gift" type="feather" color="green" size={16} style={{marginRight: 5}} />}
                                                {item.item}
                                            </Text>
                                            <Text style={styles.text}>${formatNumber(item.price)}</Text>
                                        </View>
                                        {item.customer && (
                                            <Text style={styles.text}>
                                                Xaridorning ismi: {item.customer}
                                            </Text>
                                        )}
                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </TouchableOpacity>
                        <Button
                            title="O'chirish"
                            color="red"
                            buttonStyle={styles.button}
                            onPress={() => handleDeleteOrder(item.id)}
                            icon={
                                <Icon name="trash" type='entypo' size={18} color="white" />
                            }
                        />
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.scrollContainer}
            />
            <OrderModal visible={modalVisible} onClose={handleCloseModal} order={selectedOrder} />

            {/* Floating Action Button */}
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={handleAddOrder}
            >
                <Icon name="add" type="material" color="white" size={24} />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        padding: 10,
    },
    orderItem: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
        elevation: 3, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        borderRadius: 8,
    },
    orderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    orderTitle: {
        fontWeight: 'bold',
        marginLeft: 5,
    },
    itemContainer: {
        marginBottom: 10,
        padding: 10,
        borderBottomWidth: 1,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '100%',
    },
    text: {
        fontSize: 18,
    },
    orderDate: {
        fontStyle: 'italic',
        fontSize: 16,
        color: 'gray',
        marginBottom: 10,
    },
    button: {
        backgroundColor: 'red',
        borderRadius: 8,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: 'orange',
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
});

export default OrdersScreen;
