import AsyncStorage from '@react-native-async-storage/async-storage';

const ORDER_STORAGE_KEY = '@orders';

// Function to save orders to AsyncStorage
export const saveOrders = async (orders) => {
    try {
        await AsyncStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
        console.error('Error saving orders:', error);
    }
};

// Function to retrieve orders from AsyncStorage
export const getOrders = async () => {
    try {
        const orders = await AsyncStorage.getItem(ORDER_STORAGE_KEY);
        console.log(orders, "orders")
        return orders ? JSON.parse(orders) : [];
    } catch (error) {
        console.error('Error retrieving orders:', error);
        return [];
    }
};

// Function to clear orders from AsyncStorage (optional)
export const clearOrders = async () => {
    try {
        await AsyncStorage.removeItem(ORDER_STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing orders:', error);
    }
};
