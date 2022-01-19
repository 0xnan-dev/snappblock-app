import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionPresets } from '@react-navigation/stack';
import * as React from 'react';

import { MainStackParamList } from '../types/navigation';
import { BottomTabNavigator } from './BottomTab';

const MainStack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        component={BottomTabNavigator}
        name="Main"
        options={{
          headerShown: false,
        }}
      />
    </MainStack.Navigator>
  );
}
