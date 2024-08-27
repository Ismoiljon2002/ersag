import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OrdersScreen from './screens/Orders';
import OrderModal from './components/OrdersModal';
import SummaryScreen from './screens/Summary';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, 
        }}
      >
        <Stack.Screen 
          name="Orders" 
          component={OrdersScreen} 
          options={{ headerShown: false }} 
         />
        <Stack.Screen 
          name="OrderModal" 
          component={OrderModal} 
        />
        <Stack.Screen
          name="MonthSelection"
          component={SummaryScreen}
          options={{ title: 'Oyni tanlang' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
