import './polyfill';
import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Sentry from 'sentry-expo';
import ExpoConstants from 'expo-constants';
import { theme } from './src/theme';

const isDev = process.env.NODE_ENV !== 'production';
const sentryDsn = ExpoConstants.manifest?.extra?.sentryDsn;

Sentry.init({
  dsn: sentryDsn,
  environment: process.env.APP_ENV,
  enableInExpoDevelopment: false,
  debug: isDev,
});

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
              <StatusBar style="dark" />
            </StateProvider>
          </IPFSProvider>
        </NativeBaseProvider>
      </SafeAreaProvider>
    );
  }
}
