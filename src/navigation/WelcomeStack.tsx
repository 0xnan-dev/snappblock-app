import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionPresets } from '@react-navigation/stack';
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
        component={WelcomeScreen}
        name="Welcome"
        options={{ headerShown: false }}
      />
      <WelcomeStack.Screen
        component={CreateWalletScreen}
        name="CreateWallet"
        options={{ title: 'Create Wallet', headerTitleAlign: 'center' }}
      />
      <WelcomeStack.Screen
        component={RestoreWalletScreen}
        name="RestoreWallet"
        options={{ title: 'Restore Wallet', headerTitleAlign: 'center' }}
      />
    </WelcomeStack.Navigator>
  );
}
