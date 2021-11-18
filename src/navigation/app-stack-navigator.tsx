import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import {DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY} from '../features/wallet/walletSlice';
import SplashScreen from '../screens/splash-screen';
import WelcomeScreen from '../screens/welcome';
import NewWalletScreen from '../screens/new-wallet';
import ImportSeedPhraseScreen from '../screens/import-seed-phrase';
import HomeTab, {PhotoStack} from './homeTab';

// import {selectOptionalWalletSerialization} from '../features/wallet/walletSlice';
import {useAppDispatch} from '../hooks';

const Stack = createStackNavigator();

function AppStackNavigator() {
  const dispatch = useAppDispatch();
  const [restoringWalletSeriazation, setRestoringWalletSeriazation] =
    useState(false);
  const [walletSerialization, setWalletSerialization] = useState(null);

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let serialization;
      try {
        setRestoringWalletSeriazation(true);
        serialization = await SecureStore.getItemAsync(
          DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY,
        );
      } catch (e) {
        // Restoring token failed
        dispatch({type: 'restoreSerliazationFailed', serialization: null});
        console.debug(e);
      }
      setWalletSerialization(serialization);
      dispatch({type: 'restoreSerialization', serialization: serialization});
      setRestoringWalletSeriazation(false);
    };

    bootstrapAsync();
  }, [dispatch]);

  return (
    <>
      {restoringWalletSeriazation ? (
        <SplashScreen />
      ) : (
        <Stack.Navigator screenOptions={{gestureEnabled: false}}>
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
      )}
    </>
  );
}

export default AppStackNavigator;
