import { SimpleLineIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { FC } from 'react';
import { View, Icon, IIconProps, useToken } from 'native-base';
import { ProfileScreen } from '../screens';
import { MainTabParamList } from '../types/navigation';
import { TakePictureNavigator } from './TakePictureStack';
import { GalleryNavigator } from './GalleryStack';

const TabBarIcon: FC<
  IIconProps & {
    name: React.ComponentProps<typeof SimpleLineIcons>['name'];
    color: string;
  }
> = props => {
  return (
    <Icon as={<SimpleLineIcons name={props.name} />} size={28} {...props} />
  );
};

export const BottomTab = createBottomTabNavigator<MainTabParamList>();

export function BottomTabNavigator() {
  const [colorPrimary500, colorPrimary200] = useToken('colors', [
    'primary.500',
    'primary.200',
  ]);

  return (
    <BottomTab.Navigator
      initialRouteName="Gallery"
      screenOptions={{
        tabBarActiveTintColor: colorPrimary500,
      }}
    >
      <BottomTab.Screen
        component={GalleryNavigator}
        name="Gallery"
        options={{
          tabBarLabel: '',
          headerTitleAlign: 'center',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon color={color} ml="100%" name="layers" top={2} />
          ),
        }}
      />

      <BottomTab.Screen
        component={TakePictureNavigator}
        name="TakePicture"
        options={() => ({
          tabBarLabel: '',
          headerShown: false,
          tabBarStyle: {
            display: 'none',
          },
          tabBarIcon: () => (
            <View
              alignItems="center"
              backgroundColor="primary.500"
              borderColor={colorPrimary200}
              borderRadius="full"
              borderStyle="solid"
              borderWidth={2}
              h={16}
              justifyContent="center"
              ml="100%"
              position="absolute"
              top={-24}
              w={16}
            >
              <TabBarIcon color="white" name="camera" />
            </View>
          ),
        })}
      />

      <BottomTab.Screen
        component={ProfileScreen}
        name="Profile"
        options={{
          tabBarLabel: '',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => (
            <TabBarIcon color={color} ml="100%" name="settings" top={2} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
