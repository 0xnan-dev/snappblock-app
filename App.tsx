import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './src/theme';

import {
  // useColorScheme, support dark mode later?
  useCachedResources,
  useColorModeManager,
  StateProvider,
} from './src/hooks';
import { AlertProvider } from './src/components';
import Navigation from './src/navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorModeManger = useColorModeManager();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <NativeBaseProvider theme={theme} colorModeManager={colorModeManger}>
          <AlertProvider>
            <StateProvider>
              <Navigation />
              <StatusBar style="auto" />
            </StateProvider>
          </AlertProvider>
        </NativeBaseProvider>
      </SafeAreaProvider>
    );
  }
}
