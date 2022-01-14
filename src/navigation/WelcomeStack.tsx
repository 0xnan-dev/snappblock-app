import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import {
  RestoreWalletScreen,
  CreateWalletScreen,
  WelcomeScreen,
} from '../screens';

import { WelcomeStackParamList } from '../types/navigation';

const WelcomeStack = createNativeStackNavigator<WelcomeStackParamList>();

export function WelcomeNavigator() {
  return (
    <WelcomeStack.Navigator initialRouteName="Welcome">
      <WelcomeStack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <WelcomeStack.Screen
        name="CreateWallet"
        component={CreateWalletScreen}
        options={{ title: 'Create Wallet', headerTitleAlign: 'center' }}
      />
      <WelcomeStack.Screen
        name="RestoreWallet"
        component={RestoreWalletScreen}
        options={{ title: 'Restore Wallet', headerTitleAlign: 'center' }}
      />
    </WelcomeStack.Navigator>
  );
}
