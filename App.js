import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OrdersScreen from './screens/OrdersScreen';
import OrderModal from './components/OrdersModal';
import SummaryScreen from './screens/Summary';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Hide the default header
        }}
      >
        <Stack.Screen 
          name="Orders" 
          component={OrdersScreen} 
          options={{ headerShown: false }} // Hide default header if you're using a custom TopBar
         />
        <Stack.Screen 
          name="OrderModal" 
          component={OrderModal} 
        />
        <Stack.Screen
          name="MonthSelection"
          component={SummaryScreen}
          options={{ title: 'Select Month' }} // Customize as needed
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
