import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import {DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY} from '../features/wallet/walletSlice';

import WelcomeScreen from '../screens/welcome';
import NewWalletScreen from '../screens/new-wallet';
import ImportSeedPhraseScreen from '../screens/import-seed-phrase';
import HomeTab, {PhotoStack} from './homeTab';

import {selectOptionalWalletSerialization} from '../features/wallet/walletSlice';
import {useAppSelector, useAppDispatch} from '../hooks';

const Stack = createStackNavigator();

function AppStackNavigator() {
  const dispatch = useAppDispatch();
  const walletSerialization = useAppSelector(selectOptionalWalletSerialization);
  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let serialization;
      try {
        serialization = await SecureStore.getItemAsync(
          DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY,
        );
      } catch (e) {
        // Restoring token failed
        console.debug(e);
      }
      console.debug('serialization', serialization);
      dispatch({type: 'restoreSerialization', serialization: serialization});
    };

    bootstrapAsync();
  }, [dispatch]);

  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{gestureEnabled: false}}>
      {walletSerialization ? (
        <>
          <Stack.Screen name="HK SnapShot" component={HomeTab} />
          <Stack.Screen name="PhotoStack" component={PhotoStack} />
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Seed Phrase" component={NewWalletScreen} />
          <Stack.Screen
            name="Import Seed Phrase"
            component={ImportSeedPhraseScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default AppStackNavigator;
