import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Ensure this import is correct
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../components/TopBar';
import { getOrders } from '../storage';
import { Icon } from 'react-native-elements';
import { formatNumber } from '../helpers/formatNumber';

const SummaryScreen = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const storedOrders = await getOrders();
            setOrders(storedOrders);
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        const filtered = orders.filter(order => {
            const orderDate = new Date(order.orderDate);
            const orderMonth = orderDate.getMonth() + 1; // Months are 0-indexed
            const orderYear = orderDate.getFullYear();
            return (selectedMonth ? orderMonth === selectedMonth : true) && orderYear === selectedYear;
        });
        setFilteredOrders(filtered);
    }, [selectedMonth, selectedYear, orders]);

    const calculateTotals = () => {
        return filteredOrders.reduce((sum, order) => {
            return sum + order.items.reduce((itemSum, item) => itemSum + parseFloat(item.price || '0'), 0);
        }, 0);
    };

    const calculateDiscount = () => {
        return filteredOrders.reduce((totalDiscount, order) => {
            const orderTotal = order.items.reduce((itemSum, item) => itemSum + parseFloat(item.price || '0'), 0);
            const discount = parseFloat(order.discountPercent || '0') / 100;
            const orderDiscount = orderTotal * discount;
            return totalDiscount + orderDiscount;
        }, 0);
    };

    const calculateProfitFromGifts = () => {
        return filteredOrders.reduce((totalProfit, order) => {
            return totalProfit + order.items.reduce((itemSum, item) => {
                return itemSum + (item.isGift ? parseFloat(item.price || '0') : 0);
            }, 0);
        }, 0);
    };

    const calculateYearlyTotals = () => {
        const yearlyOrders = orders.filter(order => {
            const orderYear = new Date(order.orderDate).getFullYear();
            return orderYear === selectedYear;
        });

        return yearlyOrders.reduce((sum, order) => {
            return sum + order.items.reduce((itemSum, item) => itemSum + parseFloat(item.price || '0'), 0);
        }, 0);
    };

    const calculateYearlyDiscount = () => {
        const yearlyOrders = orders.filter(order => {
            const orderYear = new Date(order.orderDate).getFullYear();
            return orderYear === selectedYear;
        });

        return yearlyOrders.reduce((totalDiscount, order) => {
            const orderTotal = order.items.reduce((itemSum, item) => itemSum + parseFloat(item.price || '0'), 0);
            const discount = parseFloat(order.discountPercent || '0') / 100;
            const orderDiscount = orderTotal * discount;
            return totalDiscount + orderDiscount;
        }, 0);
    };

    const calculateYearlyProfitFromGifts = () => {
        const yearlyOrders = orders.filter(order => {
            const orderYear = new Date(order.orderDate).getFullYear();
            return orderYear === selectedYear;
        });

        return yearlyOrders.reduce((totalProfit, order) => {
            return totalProfit + order.items.reduce((itemSum, item) => {
                return itemSum + (item.isGift ? parseFloat(item.price || '0') : 0);
            }, 0);
        }, 0);
    };

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        if (selectedMonth === null) {
            setSelectedMonth(currentMonth);
            setSelectedYear(currentYear);
        }
    }, [selectedMonth, selectedYear]);

    const isYearly = selectedMonth === 0;

    return (
        <SafeAreaView style={styles.container}>
            <TopBar
                title="Summary"
                onBackPress={() => navigation.goBack()}
            />
            <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Select Time:</Text>
                <View style={styles.pickerRow}>
                    <Picker
                        selectedValue={selectedYear}
                        onValueChange={(itemValue) => setSelectedYear(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label={`2024`} value={2024} />
                        <Picker.Item label={`2025`} value={2025} />
                        <Picker.Item label={`2026`} value={2026} />
                        {/* Add more years as needed */}
                    </Picker>

                    <Picker
                        selectedValue={selectedMonth}
                        onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select Month" value={null} />
                        <Picker.Item label={`Yearly`} value={0} />
                        <Picker.Item label={`January`} value={1} />
                        <Picker.Item label={`February`} value={2} />
                        <Picker.Item label={`March`} value={3} />
                        <Picker.Item label={`April`} value={4} />
                        <Picker.Item label={`May`} value={5} />
                        <Picker.Item label={`June`} value={6} />
                        <Picker.Item label={`July`} value={7} />
                        <Picker.Item label={`August`} value={8} />
                        <Picker.Item label={`September`} value={9} />
                        <Picker.Item label={`October`} value={10} />
                        <Picker.Item label={`November`} value={11} />
                        <Picker.Item label={`December`} value={12} />
                    </Picker>
                </View>
                <View style={styles.summary}>
                    <Text style={styles.summaryText}>
                        <Icon name="dollar-sign" type="feather" color="#1E90FF" size={15} /> {isYearly ? "Yearly" : "Monthly"} Total Price:
                        ${formatNumber(isYearly ? calculateYearlyTotals() : calculateTotals())}
                    </Text>
                    <Text style={[styles.summaryText, styles.profitText]}>
                        <Icon name="percent" type="feather" color="#FF6347" size={15} /> {isYearly ? "Yearly" : "Monthly"} Total Discount:
                        ${formatNumber(isYearly ? calculateYearlyDiscount() : calculateDiscount())}
                    </Text>
                    <Text style={[styles.summaryText, styles.profitText]}>
                        <Icon name="gift" type="feather" color="green" size={15} /> {isYearly ? "Yearly" : "Monthly"} Profit From Gifts:
                        ${formatNumber(isYearly ? calculateYearlyProfitFromGifts() : calculateProfitFromGifts())}
                    </Text>
                </View>
            </View>
            <FlatList
                data={filteredOrders}
                renderItem={({ item }) => (
                    <View style={styles.orderItem}>
                        <View style={styles.orderHeader}>
                            <Text style={styles.orderDate}>
                                <Icon name="calendar" type="feather" color="blue" size={16} /> {item.orderDate.split('T')[0]}
                            </Text>
                            <Text style={styles.orderDate}>
                                <Icon name="percent" type="feather" color="blue" size={16} />
                                {item.discountPercent}
                            </Text>
                        </View>
                        <FlatList
                            data={item.items}
                            renderItem={({ item, index }) => (
                                <View style={styles.itemContainer}>
                                    <Text style={styles.text}>
                                        {index + 1}. {item.item} - ${formatNumber(item.price)}
                                    </Text>
                                    {item.isGift && <Icon name="gift" type="feather" color="green" size={18} />}
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.scrollContainer}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 0,
    },
    pickerContainer: {
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        padding: 10,
    },
    pickerLabel: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    picker: {
        height: 50,
        width: '45%', // Adjust width as necessary
    },
    summary: {
        paddingHorizontal: 20
    },
    summaryText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    profitText: {
        color: 'green',
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    orderItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        margin: 20,
        elevation: 2, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderDate: {
        fontSize: 17,
        color: 'gray',
        marginBottom: 10,
    },
    itemContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
});

export default SummaryScreen;
