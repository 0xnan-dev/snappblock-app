import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  restoreWalletSeralization,
  selectOptionalWalletSerialization,
  selectIsWalletRestoring
} from '../features/wallet/walletSlice';
import SplashScreen from '../screens/splash';
import WelcomeScreen from '../screens/welcome';
import NewWalletScreen from '../screens/new-wallet';
import ImportSeedPhraseScreen from '../screens/import-seed-phrase';
import HomeTabNavigator, {PhotoStack} from './home-tab-navigator';
import {useAppDispatch, useAppSelector} from '../hooks';

const Stack = createStackNavigator();

function AppStackNavigator() {
  const dispatch = useAppDispatch();
  const walletSerialization = useAppSelector(selectOptionalWalletSerialization);
  const isWalletRestoring = useAppSelector(selectIsWalletRestoring);
  React.useEffect(() => {
    const bootstrapAsync = async () => {
      dispatch(restoreWalletSeralization());
    };

    bootstrapAsync();
  }, [dispatch]);

  return (
    <>
      {walletSerialization == null && isWalletRestoring ? (
        <SplashScreen />
      ) : (
        <Stack.Navigator screenOptions={{gestureEnabled: false}}>
          {walletSerialization ? (
            <Stack.Group>
              <Stack.Screen
                name="Home"
                component={HomeTabNavigator}
                options={{headerShown: true, title: ''}}
              />
              <Stack.Screen name="PhotoStack" component={PhotoStack} />
            </Stack.Group>
          ) : (
            <Stack.Group>
              <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{headerShown: false, title: ''}}
              />
              <Stack.Screen
                name="New Wallet"
                component={NewWalletScreen}
                options={{headerShown: true}}
              />
              <Stack.Screen
                name="Import Seed Phrase"
                component={ImportSeedPhraseScreen}
              />
            </Stack.Group>
          )}
        </Stack.Navigator>
      )}
    </>
  );
}

export default AppStackNavigator;
