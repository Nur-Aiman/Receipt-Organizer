import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

function HomeScreen(props) {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Home</Text> */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('AddReceipt')}
          style={styles.button}
        >
          <Icon name='camera' size={30} color='#FFFFFF' />
          <Text style={styles.buttonText}>Add Receipt</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('ViewReceipts')}
          style={styles.button}
        >
          <Icon name='list' size={30} color='#FFFFFF' />
          <Text style={styles.buttonText}>View Receipts</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#333333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  button: {
    width: 100,
    height: 100,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    borderRadius: 70,
    backgroundColor: '#990100',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
})

export default HomeScreen
