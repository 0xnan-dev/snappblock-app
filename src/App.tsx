import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  useCachedResources,
  useColorScheme,
  useColorModeManager,
  StateProvider,
} from './hooks';
import { AlertProvider } from './components';
import Navigation from './navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const colorModeManger = useColorModeManager();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <NativeBaseProvider colorModeManager={colorModeManger}>
          <AlertProvider>
            <StateProvider>
              <Navigation colorScheme={colorScheme} />
              <StatusBar style="auto" />
            </StateProvider>
          </AlertProvider>
        </NativeBaseProvider>
      </SafeAreaProvider>
    );
  }
}
