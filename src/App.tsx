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
import {NativeBaseProvider} from 'native-base';
import AppStackNavigator from './navigation/app-stack-navigator';
import {IPFSProvider} from './hooks';
import {Provider} from 'react-redux';
import {store} from './store';

const App = () => {
  return (
    <Provider store={store}>
      <IPFSProvider>
        <NativeBaseProvider>
          <NavigationContainer>
            <AppStackNavigator />
          </NavigationContainer>
        </NativeBaseProvider>
      </IPFSProvider>
    </Provider>
  );
};
export default App;
