import React, { useState, useEffect } from 'react'
import {
  View,
  Alert,
  Text,
  Button,
  SectionList,
  Image,
  TouchableOpacity,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TextInput } from 'react-native'

const monthNumber = (monthName) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return monthNames.indexOf(monthName)
}

function ViewReceiptsScreen(props) {
  const [receipts, setReceipts] = useState([])
  const [totalSpent, setTotalSpent] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchReceipts = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('receiptInfo')
      if (jsonValue !== null) {
        let data = JSON.parse(jsonValue)
        let total = 0

        if (searchTerm) {
          data = data.filter(
            (receipt) =>
              receipt.info.toLowerCase().includes(searchTerm.toLowerCase()) ||
              receipt.price.toLowerCase().includes(searchTerm.toLowerCase()) ||
              receipt.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
              receipt.category
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              receipt.comment.toLowerCase().includes(searchTerm.toLowerCase())
          )
        }

        const receiptsByMonth = data.reduce((acc, receipt) => {
          const date = new Date(receipt.date)
          const monthYear = `${date.toLocaleString('default', {
            month: 'long',
          })} ${date.getFullYear()}`

          if (!acc[monthYear]) {
            acc[monthYear] = { receipts: [], total: 0 }
          }

          acc[monthYear].receipts.push(receipt)
          acc[monthYear].total += Number(receipt.price)
          total += Number(receipt.price)

          return acc
        }, {})

        let formattedReceipts = Object.entries(receiptsByMonth).map(
          ([monthYear, { receipts, total }]) => {
            const [month, year] = monthYear.split(' ')
            return {
              title: `${monthYear} | RM${total.toFixed(2)}`,
              data: receipts.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
              ),
              monthYear: new Date(year, monthNumber(month)),
            }
          }
        )

        formattedReceipts.sort((a, b) => b.monthYear - a.monthYear)

        setReceipts(formattedReceipts)
        setTotalSpent(total)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const deleteAllReceipts = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete all receipts?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('receiptInfo')
              setReceipts([])
              Alert.alert('Success', 'All receipts have been deleted')
            } catch (e) {
              console.error(e)
            }
          },
        },
      ]
    )
  }

  useEffect(() => {
    fetchReceipts()
    const unsubscribe = props.navigation.addListener('focus', () => {
      fetchReceipts()
    })
    return unsubscribe
  }, [props.navigation, searchTerm])

  return (
    <View
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333333',
      }}
    >
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          borderRadius: 10,
          width: 200,
          marginTop: 10,
          backgroundColor: '#F6F6F6',
          textAlign: 'center',
        }}
        onChangeText={(text) => setSearchTerm(text)}
        value={searchTerm}
        placeholder='Search Receipt'
      />

      <SectionList
        sections={receipts}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('ViewReceipt', { receiptId: item.id })
            }
          >
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: 390,
                  height: 70,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: '#E8E8E8',
                  borderRadius: 10,
                  marginVertical: 1,
                }}
              >
                <View>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 20,
                      marginLeft: 20,
                      marginVertical: 5,
                    }}
                  >
                    {item.info}
                  </Text>
                  <Text style={{ color: 'grey', fontSize: 15, marginLeft: 20 }}>
                    {item.category}
                  </Text>
                </View>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 15,
                    marginTop: 20,
                    marginRight: 10,
                    fontWeight: 'bold',
                  }}
                >
                  RM{item.price}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              color: '#E8E8E8',

              textAlign: 'center',
              backgroundColor: '#333333',
            }}
          >
            {title}
          </Text>
        )}
      />
      <TouchableOpacity
        onPress={deleteAllReceipts}
        style={{
          backgroundColor: '#FF0000',
          padding: 10,
          borderRadius: 5,
          marginVertical: 10,
        }}
      >
        <Text
          style={{
            color: '#FFFFFF',
            textAlign: 'center',
            fontSize: 16,
          }}
        >
          Delete All Receipts
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default ViewReceiptsScreen
