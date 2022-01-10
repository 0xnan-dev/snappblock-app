import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './src/theme';

import {
  useCachedResources,
  useColorModeManager,
  StateProvider,
} from './src/hooks';
import { AlertProvider, ModalProvider } from './src/components';
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
            <ModalProvider>
              <StateProvider>
                <Navigation />
                <StatusBar style="auto" />
              </StateProvider>
            </ModalProvider>
          </AlertProvider>
        </NativeBaseProvider>
      </SafeAreaProvider>
    );
  }
}
