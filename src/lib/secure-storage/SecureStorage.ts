import { getItemAsync, setItemAsync } from 'expo-secure-store';

export const SecureStore = {
  getItem: (key: string) => getItemAsync(key),

  setItem: (key: string, item: string) => setItemAsync(key, item),
};
