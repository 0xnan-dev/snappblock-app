import { SimpleLineIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { FC, useEffect, useRef } from 'react';
import { Factory, Box, Icon, IIconProps, useToken } from 'native-base';

import { GalleryScreen, ProfileScreen, CameraScreen } from '../screens';
import { MainTabParamList } from '../types';
import { Animated } from 'react-native';

const TabBarIcon: FC<
  IIconProps & {
    name: React.ComponentProps<typeof SimpleLineIcons>['name'];
    color: string;
  }
> = props => {
  return <Icon as={<SimpleLineIcons />} size={28} {...props} />;
};

export const BottomTab = createBottomTabNavigator<MainTabParamList>();

const CameraIcon: FC<{ focused: boolean }> = ({ focused }) => {
  const [colorPrimary500, colorPrimary200] = useToken('colors', [
    'primary.500',
    'primary.200',
  ]);
  const slideAnim = useRef(new Animated.Value(8)).current;
  const anim = Animated.timing(slideAnim, {
    toValue: 16,
    duration: 500,
    useNativeDriver: true,
  });

  useEffect(() => {
    if (focused) {
      anim.start();
    } else {
      anim.reset();
      slideAnim.setValue(8);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anim, focused]);

  return (
    <Animated.View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        bottom: slideAnim,
        position: 'absolute',
        borderColor: focused ? colorPrimary200 : undefined,
        borderWidth: focused ? 3 : 0,
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
    </Animated.View>
  );
};

export function BottomTabNavigator() {
  const [colorPrimary500] = useToken('colors', ['primary.500']);

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
          title: 'Gallery',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => <TabBarIcon name="layers" color={color} />,
        }}
      />

      <BottomTab.Screen
        name="Camera"
        component={CameraScreen}
        options={({ navigation }) => ({
          title: 'Camera',
          tabBarLabel: '',
          headerShown: false,
          tabBarIcon: () => {
            const navState = navigation.getState();

            return (
              <CameraIcon
                focused={navState.routeNames[navState.index] === 'Camera'}
              />
            );
          },
        })}
      />

      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="settings" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
