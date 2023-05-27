import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Camera } from 'expo-camera'
import DatePicker from 'react-native-datepicker'
import { Picker } from '@react-native-picker/picker'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

function AddReceiptScreen() {
  const [receiptInfo, setReceiptInfo] = useState({
    id: '',
    info: '',
    price: '',
    currency: '',
    date: new Date(),
    category: '',
    comment: '',
  })
  const [photo, setPhoto] = useState(null)
  const [tempPhoto, setTempPhoto] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [isDeleteMode, setIsDeleteMode] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)

  const cameraRef = useRef()

  const saveReceiptInfo = async () => {
    if (photo === null) {
      Alert.alert('Error', 'Please capture a photo first')
      return
    }

    const uniqueId = uuidv4()

    try {
      const jsonValue = await AsyncStorage.getItem('receiptInfo')
      let data = null

      if (jsonValue != null) {
        data = JSON.parse(jsonValue)
        data.push({ ...receiptInfo, id: uniqueId, image: photo })
      } else {
        data = [{ ...receiptInfo, id: uniqueId, image: photo }]
      }

      await AsyncStorage.setItem('receiptInfo', JSON.stringify(data))

      Alert.alert('Success', 'Receipt has been saved successfully')

      setReceiptInfo({
        id: '',
        info: '',
        price: '',
        currency: '',
        date: '',
        category: '',
        comment: '',
      })
      setPhoto(null)
      setShowCamera(true)

      console.log(data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleOpenCamera = () => {
    setShowCamera(true)
  }

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync()
      setTempPhoto(photo.uri)
    }
  }

  const handleUsePhoto = () => {
    setPhoto(tempPhoto)
    setTempPhoto(null)
    setShowCamera(false)
  }

  const handleRetake = () => {
    setTempPhoto(null)
  }

  useEffect(() => {
    retrieveCategories()
  }, [categories])

  const retrieveCategories = async () => {
    try {
      const value = await AsyncStorage.getItem('@categories')
      if (value !== null) {
        setCategories(JSON.parse(value))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addNewCategory = async (newCategory) => {
    const updatedCategories = [...categories, newCategory]
    setCategories(updatedCategories)

    try {
      await AsyncStorage.setItem(
        '@categories',
        JSON.stringify(updatedCategories)
      )
    } catch (error) {
      console.log(error)
    }
  }

  const resetCategories = async () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete all categories?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('@categories')
              setCategories([])
            } catch (error) {
              console.log(error)
            }
          },
        },
      ],
      { cancelable: false }
    )
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {!showCamera && !photo && (
        <Button title='Take Picture' onPress={handleOpenCamera} />
      )}
      {showCamera && !tempPhoto && (
        <Camera style={{ flex: 1, width: '100%' }} ref={cameraRef}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginBottom: 50,
              backgroundColor: 'transparent',
            }}
          >
            <TouchableOpacity
              onPress={handleCapture}
              style={{
                borderWidth: 2,
                borderColor: 'rgba(0,0,0,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
                width: 70,
                height: 70,
                backgroundColor: '#fff',
                borderRadius: 50,
              }}
            >
              <Text
                style={{ fontSize: 18, alignSelf: 'center', color: 'black' }}
              ></Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
      {showCamera && tempPhoto && (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Image
            source={{ uri: tempPhoto }}
            style={{
              flex: 1,
              width: 395,

              resizeMode: 'cover',
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 50,
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
            }}
          >
            <TouchableOpacity style={{}} onPress={handleRetake}>
              <Text style={{ color: '#F6F6F6', fontSize: 20 }}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{}} onPress={handleUsePhoto}>
              <Text style={{ color: '#F6F6F6', fontSize: 20 }}>Use Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!showCamera && photo && (
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 350,
            height: 500,
            backgroundColor: '#E8E8E8',
            marginTop: 100,
            borderRadius: 50,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,

              width: 300,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text>Item : </Text>
            <TextInput
              style={{
                height: 40,
                borderColor: 'gray',
                borderWidth: 1,
                width: '70%',
              }}
              placeholder='Enter item name'
              onChangeText={(text) =>
                setReceiptInfo({ ...receiptInfo, info: text })
              }
              value={receiptInfo.info}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,

              width: 300,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text>Price : </Text>
            <TextInput
              style={{
                height: 40,
                borderColor: 'gray',
                borderWidth: 1,
                width: '70%',
              }}
              placeholder='Enter price'
              onChangeText={(text) =>
                setReceiptInfo({ ...receiptInfo, price: text })
              }
              value={receiptInfo.price}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
              width: 300,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text>Category : </Text>
            <TouchableOpacity
              style={{
                height: 40,
                borderColor: 'gray',
                borderWidth: 1,
                width: '70%',
                justifyContent: 'center',
              }}
              onPress={() => setIsModalVisible(true)}
            >
              <Text style={{ paddingLeft: 10 }}>
                {receiptInfo.category || 'Select a category'}
              </Text>
            </TouchableOpacity>
            <Modal
              animationType='slide'
              transparent={true}
              visible={isModalVisible}
              onRequestClose={() => {
                setIsModalVisible(!isModalVisible)
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 22,
                }}
              >
                <View
                  style={{
                    margin: 20,
                    backgroundColor: 'white',
                    borderRadius: 20,
                    padding: 35,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                  }}
                >
                  <ScrollView
                    style={{
                      maxHeight: 250,
                      backgroundColor: '#E8E8E8',
                      width: 200,
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    {categories.map((category, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          if (isDeleteMode) {
                            setCategoryToDelete(category)
                          } else {
                            setReceiptInfo({
                              ...receiptInfo,
                              category: category,
                            })
                            setIsModalVisible(!isModalVisible)
                          }
                        }}
                      >
                        <Text style={{ fontSize: 16, marginBottom: 10 }}>
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    {isDeleteMode && (
                      <TouchableOpacity
                        onPress={() => setIsDeleteMode(false)}
                        style={{ marginTop: 20 }}
                      >
                        <Text style={{ color: 'blue', fontSize: 16 }}>
                          Done
                        </Text>
                      </TouchableOpacity>
                    )}
                  </ScrollView>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      marginTop: 10,
                    }}
                  >
                    <TextInput
                      style={{
                        height: 40,
                        borderColor: 'gray',
                        borderWidth: 1,
                        width: '70%',
                        marginLeft: 50,
                      }}
                      placeholder='Add new category'
                      onChangeText={(text) => setNewCategory(text)}
                      value={newCategory}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        addNewCategory(newCategory)
                        setNewCategory('')
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          marginLeft: 10,
                          padding: 10,
                          color: 'blue',
                        }}
                      >
                        Add
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity onPress={resetCategories}>
                    <Text
                      style={{
                        fontSize: 16,
                        marginLeft: 10,
                        marginTop: 20,
                        padding: 10,
                        color: 'red',
                      }}
                    >
                      Reset Categories
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ marginTop: 20 }}
                    onPress={() => setIsModalVisible(!isModalVisible)}
                  >
                    <Text style={{ color: 'blue', fontSize: 16 }}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,

              width: 300,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text>Comment : </Text>
            <TextInput
              style={{
                height: 40,
                borderColor: 'gray',
                borderWidth: 1,
                width: '70%',
              }}
              placeholder='Enter comment'
              onChangeText={(text) =>
                setReceiptInfo({ ...receiptInfo, comment: text })
              }
              value={receiptInfo.comment}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <Text>Date : </Text>
            <DatePicker
              style={{ width: 200 }}
              date={receiptInfo.date}
              mode='date'
              placeholder='select date'
              format='YYYY-MM-DD'
              minDate='2000-05-01'
              maxDate='2030-06-01'
              confirmBtnText='Confirm'
              cancelBtnText='Cancel'
              onDateChange={(date) =>
                setReceiptInfo({ ...receiptInfo, date: date })
              }
            />
          </View>

          <Button title='Save' onPress={saveReceiptInfo} />
        </ScrollView>
      )}
    </View>
  )
}

export default AddReceiptScreen
