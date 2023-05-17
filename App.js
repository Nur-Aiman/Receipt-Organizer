import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './screens/Home'
import AddReceiptScreen from './screens/AddReceipt'
import ViewReceiptsScreen from './screens/ViewReceipts'
import ViewReceiptScreen from './screens/ViewReceipt'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      {
        <Stack.Navigator>
          <Stack.Screen
            name='Home'
            component={HomeScreen}
            options={{
              title: 'Receipt Organizer',
              headerStyle: { backgroundColor: '#990100' },
              headerTitleStyle: { color: 'white' },
            }}
          />
          <Stack.Screen
            name='AddReceipt'
            component={AddReceiptScreen}
            options={{
              title: 'Add Receipt',
              headerStyle: { backgroundColor: '#990100' },
              headerTitleStyle: { color: 'white' },
              headerTintColor: 'white',
            }}
          />
          <Stack.Screen
            name='ViewReceipts'
            component={ViewReceiptsScreen}
            options={{
              title: 'My Receipts',
              headerStyle: { backgroundColor: '#990100' },
              headerTitleStyle: { color: '#F6F6F6' },
              headerTintColor: '#E8E8E8',
            }}
          />
          <Stack.Screen
            name='ViewReceipt'
            component={ViewReceiptScreen}
            options={{
              title: 'View Receipt',
              headerStyle: { backgroundColor: '#990100' },
              headerTitleStyle: { color: 'white' },
              headerTintColor: '#E8E8E8',
            }}
          />
        </Stack.Navigator>
      }
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
