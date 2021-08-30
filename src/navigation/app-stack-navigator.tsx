import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/welcome';
import ImportSeedPhraseScreen from '../screens/import-seed-phrase';

const Stack = createStackNavigator();

function AppStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{gestureEnabled: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Import Seed Phrase" component={ImportSeedPhraseScreen} />
    </Stack.Navigator>
  );
}

export default AppStackNavigator;
