import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomeScreen from '../screens/welcome';
import NewWalletScreen from '../screens/new-wallet';
import ImportSeedPhraseScreen from '../screens/import-seed-phrase';
import SnapshotScreen from '../screens/snapshot';

const Stack = createStackNavigator();

function AppStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{gestureEnabled: false}}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Seed Phrase" component={NewWalletScreen} />
      <Stack.Screen
        name="Import Seed Phrase"
        component={ImportSeedPhraseScreen}
      />
      <Stack.Screen
        name="Snap Shot"
        component={SnapshotScreen}
      />
    </Stack.Navigator>
  );
}

export default AppStackNavigator;
