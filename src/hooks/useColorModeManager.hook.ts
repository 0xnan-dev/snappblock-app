import AsyncStorage from '@react-native-community/async-storage';
import { ColorMode, StorageManager } from 'native-base';

export const useColorModeManager = () => {
  const colorModeManager: StorageManager = {
    get: async () => {
      try {
        const val = await AsyncStorage.getItem('@color-mode');

        return val === 'dark' ? 'dark' : 'light';
      } catch (e) {
        console.error(e);

        return 'light';
      }
    },
    set: async (value: NonNullable<ColorMode>) => {
      try {
        await AsyncStorage.setItem('@color-mode', value);
      } catch (e) {
        console.log(e);
      }
    },
  };

  return colorModeManager;
};
