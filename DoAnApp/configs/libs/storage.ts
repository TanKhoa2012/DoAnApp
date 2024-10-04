import AsyncStorage from '@react-native-async-storage/async-storage';
import { isEmpty } from 'lodash';
import * as SecureStore from 'expo-secure-store';



export const setStorageItem = async (key: string, value: any) => {
    if (isEmpty(key)) throw new Error('Invalid key');

    const data =JSON.stringify(value);
    await AsyncStorage.setItem(key,data);
};

export const getStorageItem = async (key:string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // Chuyển chuỗi JSON trở lại thành đối tượng
        const data = JSON.parse(value);
        return data;
      }
      return null;
    } catch (error) {
      console.error('Failed to retrieve data:', error);
      return null;
    }
  };

  export const removeStorageItem = async (key:string) => {
    try {
      await AsyncStorage.removeItem(key);
      console.log('Data cleared successfully!');
    } catch (error) {
      console.error('Failed to remove data:', error);
    }
  };


//Secure

export const setDataSecure = async (key: string, value: any) => {
  try {
    const data = JSON.stringify(value);
    await SecureStore.setItemAsync(key, data);
    console.log('Data saved successfully');
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const getDataSecure = async (key: string) => {
  try {
    const data = await SecureStore.getItemAsync(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting data:', error);
    return null;
  }
};

export const deleteDataSecure = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
    console.log('Data deleted successfully');
  } catch (error) {
    console.error('Error deleting data:', error);
  }
};