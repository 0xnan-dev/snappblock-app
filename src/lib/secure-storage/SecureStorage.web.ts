import AsyncStorage from '@react-native-async-storage/async-storage';

export const SecureStore = {
  getItem: (key: string) => AsyncStorage.getItem(key),

  setItem: (key: string, item: string) => AsyncStorage.setItem(key, item),
};
