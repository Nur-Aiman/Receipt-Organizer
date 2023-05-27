import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  Button,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

function ViewReceiptScreen({ route, navigation }) {
  const [receipt, setReceipt] = useState(null)
  const { receiptId } = route.params
  const [isModalVisible, setModalVisible] = useState(false)

  const fetchReceipt = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('receiptInfo') //All receipts
      const receipts = jsonValue ? JSON.parse(jsonValue) : [] //All receipts
      const foundReceipt = receipts.find((r) => r.id === receiptId) //Receipt with specific id

      if (foundReceipt) {
        setReceipt(foundReceipt)
      } else {
        console.error('Receipt not found')
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchReceipt()
  }, [])

  if (!receipt) {
    return <Text>Loading...</Text>
  }

  const deleteReceipt = async () => {
    Alert.alert(
      'Delete Receipt',
      'Are you sure you want to delete this receipt?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            const jsonValue = await AsyncStorage.getItem('receiptInfo')
            let receipts = jsonValue ? JSON.parse(jsonValue) : []
            receipts = receipts.filter((r) => r.id !== receiptId)

            try {
              await AsyncStorage.setItem(
                'receiptInfo',
                JSON.stringify(receipts)
              )
              Alert.alert(
                'Receipt Deleted',
                'The receipt has been deleted successfully',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              )
            } catch (e) {
              console.error(e)
            }
          },
        },
      ],
      { cancelable: false }
    )
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#333333',
      }}
    >
      {/* <Text>{receipt.id}</Text> */}

      <View
        style={{
          backgroundColor: '#E8E8E8',
          alignItems: 'center',
          marginTop: 10,
          padding: 20,
          borderRadius: 20,
          width: 390,
          height: 480,
        }}
      >
        <View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={{ uri: receipt.image }}
              style={{
                width: 200,
                height: 200,
                marginTop: 10,
                marginBottom: 30,
                borderRadius: 10,
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 5,

            width: '65%',
          }}
        >
          <Text>ITEM:</Text>
          <Text style={{ fontWeight: 'bold' }}>{receipt.info}</Text>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 5,
            width: '65%',
          }}
        >
          <Text>PRICE:</Text>
          <Text style={{ fontWeight: 'bold' }}>RM{receipt.price}</Text>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 5,
            width: '65%',
          }}
        >
          <Text>DATE ADDED:</Text>
          <Text style={{ fontWeight: 'bold' }}>{receipt.date}</Text>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 5,
            width: '65%',
          }}
        >
          <Text>CATEGORY:</Text>
          <Text style={{ fontWeight: 'bold' }}>{receipt.category}</Text>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 5,
            width: '65%',
          }}
        >
          <Text>COMMENT:</Text>
          <Text style={{ fontWeight: 'bold' }}>{receipt.comment}</Text>
        </View>

        <TouchableOpacity
          onPress={deleteReceipt}
          style={{
            padding: 10,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: 'red', marginTop: 60 }}>Delete Receipt</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType='slide'
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <Image
            source={{ uri: receipt.image }}
            style={{ width: 380, height: 600, borderRadius: 20 }}
          />
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

export default ViewReceiptScreen
