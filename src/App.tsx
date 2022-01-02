import React, { useEffect, useState } from 'react';
import { NativeBaseProvider } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  useCachedResources,
  useColorScheme,
  useColorModeManager,
  StateProvider,
  useStateValue,
} from './hooks';
import { Alert } from './components';
import Navigation from './navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const colorModeManger = useColorModeManager();
  const { alert } = useStateValue();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <NativeBaseProvider colorModeManager={colorModeManger}>
          <StateProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar style="auto" />
            {alert && <Alert {...alert} />}
          </StateProvider>
        </NativeBaseProvider>
      </SafeAreaProvider>
    );
  }
}
