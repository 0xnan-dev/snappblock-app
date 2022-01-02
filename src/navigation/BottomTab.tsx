import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { FC } from 'react';
import { Icon, IIconProps } from 'native-base';
import { Pressable } from 'react-native';

import { Colors } from '../constants';
import { useColorScheme } from '../hooks/useColorScheme.hook';
import { TabOneScreen, TabTwoScreen } from '../screens';
import { MainTabParamList, MainTabScreenProps } from '../types';

const TabBarIcon: FC<
  IIconProps & {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
  }
> = props => {
  return <Icon as={<FontAwesome />} size={30} marginBottom={-3} {...props} />;
};

export const BottomTab = createBottomTabNavigator<MainTabParamList>();

export function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name="TabOne"
        component={TabOneScreen}
        options={({ navigation }: MainTabScreenProps<'TabOne'>) => ({
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Icon
                as={<FontAwesome name="info-circle" />}
                marginRight={15}
                size={25}
                color={Colors[colorScheme].text}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoScreen}
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}
