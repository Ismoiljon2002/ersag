import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OrdersScreen from './screens/OrdersScreen';
import OrderModal from './components/OrdersModal';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Hide the default header
        }}
      >
        <Stack.Screen name="Orders" component={OrdersScreen} />
        <Stack.Screen name="OrderModal" component={OrderModal} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
