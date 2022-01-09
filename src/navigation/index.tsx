/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { navbarTheme } from '../theme';
import { useAppState } from '../hooks';

import LinkingConfiguration from './LinkingConfiguration';
import { MainNavigator } from './MainStack';
import { WelcomeNavigator } from './WelcomeStack';

export default function Navigation() {
  const { hasStoredWallet, wallet } = useAppState();

  return (
    <NavigationContainer linking={LinkingConfiguration} theme={navbarTheme}>
      {hasStoredWallet && wallet ? <MainNavigator /> : <WelcomeNavigator />}
    </NavigationContainer>
  );
}
