import { SimpleLineIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { FC } from 'react';
import { View, Icon, IIconProps, useToken } from 'native-base';
import { GalleryScreen, ProfileScreen } from '../screens';
import { MainTabParamList } from '../types/navigation';
import { TakePictureNavigator } from './TakePictureStack';

const TabBarIcon: FC<
  IIconProps & {
    name: React.ComponentProps<typeof SimpleLineIcons>['name'];
    color: string;
  }
> = props => {
  return <Icon as={<SimpleLineIcons />} size={28} {...props} />;
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
        name="Gallery"
        component={GalleryScreen}
        options={{
          tabBarLabel: '',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => <TabBarIcon name="layers" color={color} />,
        }}
      />

      <BottomTab.Screen
        name="TakePicture"
        component={TakePictureNavigator}
        options={() => ({
          tabBarLabel: '',
          headerShown: false,
          tabBarStyle: {
            display: 'none',
          },
          tabBarIcon: () => (
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                bottom: 4,
                position: 'absolute',
                borderColor: colorPrimary200,
                borderWidth: 3,
                borderStyle: 'solid',
                height: 64,
                width: 64,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 64,
                backgroundColor: colorPrimary500,
              }}
            >
              <TabBarIcon name="camera" color="white" />
            </View>
          ),
        })}
      />

      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="settings" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
