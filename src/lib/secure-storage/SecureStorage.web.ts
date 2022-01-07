import AsyncStorage from '@react-native-community/async-storage';

export const SecureStore = {
  getItem: (key: string) => AsyncStorage.getItem(key),

  setItem: (key: string, item: string) => AsyncStorage.setItem(key, item),
};
