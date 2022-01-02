/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';
import { useStateValue } from '../hooks';

import LinkingConfiguration from './LinkingConfiguration';
import { MainNavigator } from './MainStack';
import { WelcomeNavigator } from './WelcomeStack';

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const { hasStoredWallet, wallet } = useStateValue();

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      {hasStoredWallet && wallet ? <MainNavigator /> : <WelcomeNavigator />}
    </NavigationContainer>
  );
}
