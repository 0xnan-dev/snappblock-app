/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';

import AppStackNavigator from './navigation/app-stack-navigator';
import { IpfsProvider } from './navigation/ipfs-http-client';
// import RootNavigator from './navigation/root-navigator';


const App = () => {
  return (
    <IpfsProvider>
      <NativeBaseProvider>
        <NavigationContainer>
          <AppStackNavigator />
        </NavigationContainer>
      </NativeBaseProvider>
    </IpfsProvider>
  );
};
export default App;
