import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './src/theme';

import {
  useCachedResources,
  useColorModeManager,
  StateProvider,
  IPFSProvider,
} from './src/hooks';
import Navigation from './src/navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorModeManger = useColorModeManager();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <NativeBaseProvider colorModeManager={colorModeManger} theme={theme}>
          <IPFSProvider>
            <StateProvider>
              <Navigation />
              <StatusBar style="auto" />
            </StateProvider>
          </IPFSProvider>
        </NativeBaseProvider>
      </SafeAreaProvider>
    );
  }
}
