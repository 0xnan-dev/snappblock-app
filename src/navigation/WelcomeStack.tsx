/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  RestoreWalletScreen,
  CreateWalletScreen,
  WelcomeScreen,
} from '../screens';

import { WelcomeStackParamList } from '../types';

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const WelcomeStack = createNativeStackNavigator<WelcomeStackParamList>();

export function WelcomeNavigator() {
  return (
    <WelcomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <WelcomeStack.Screen name="Welcome" component={WelcomeScreen} />
      <WelcomeStack.Screen
        name="CreateWallet"
        component={CreateWalletScreen}
        options={{ title: 'Create Wallet' }}
      />
      <WelcomeStack.Screen
        name="RestoreWallet"
        component={RestoreWalletScreen}
        options={{ title: 'Restore Wallet' }}
      />
    </WelcomeStack.Navigator>
  );
}
