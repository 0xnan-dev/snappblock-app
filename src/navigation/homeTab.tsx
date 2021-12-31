import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TabBarComponent} from '../components/BottomTabBar';
import CustomAccountIcon from '../components/CustomTabIcons/CustomAccountIcon';
import HomeScreen from '../screens/home';
import SnapshotScreen from '../screens/snapshot';
import TakePhotoScreen from '../screens/photos/takePhoto';
import StoryProcessorScreen from '../screens/photos/storyProcessor';
import PreUploadSuperImageScreen from '../screens/photos/preUploadSuperImage';
import GalleryChooserScreen from '../screens/photos/galleryChooser';
import LocationChooserScreen from '../screens/photos/locationChooser';

export type HomeTabParamList = {
  Home: undefined;
  Creator: undefined;
  Account: undefined;
  Follow: {
    type: 1 | 2;
  };
};
const Stack = createStackNavigator();
const AccountStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}>
      <Stack.Screen component={HomeScreen} name="HomeScreen" />
    </Stack.Navigator>
  );
};

const CreatorStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}>
      {/* <Stack.Screen component={HomeScreen} name="HomeScreen" /> */}
      <Stack.Screen name="GalleryChooser" component={GalleryChooserScreen} />
      <Stack.Screen name="LocationChooser" component={LocationChooserScreen} />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}>
      <Stack.Screen name="Snappblock" component={HomeScreen} />
      <Stack.Screen name="Snap Shot" component={SnapshotScreen} />
      <Stack.Screen name="GalleryChooser" component={GalleryChooserScreen} />
      <Stack.Screen name="LocationChooser" component={LocationChooserScreen} />
      <Stack.Screen
        name="PreUploadSuperImage"
        component={PreUploadSuperImageScreen}
      />
    </Stack.Navigator>
  );
};

export const PhotoStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}>
      <Stack.Screen name="Take Photo" component={TakePhotoScreen} />
      <Stack.Screen name="StoryProcessor" component={StoryProcessorScreen} />
      <Stack.Screen name="GalleryChooser" component={GalleryChooserScreen} />
      <Stack.Screen name="LocationChooser" component={LocationChooserScreen} />
      <Stack.Screen
        name="PreUploadSuperImage"
        component={PreUploadSuperImageScreen}
      />
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator<HomeTabParamList>();
const HomeTab = () => {
  const navigationOptions: BottomTabNavigationOptions = {
    headerShown: false,
  };
  return (
    <Tab.Navigator tabBar={TabBarComponent} screenOptions={navigationOptions}>
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <Icon name="home" size={30} color={focused ? '#000' : '#ddd'} />
          ),
        }}
        component={HomeStack}
        name="Home"
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <Icon name="plus-box" size={30} color={focused ? '#000' : '#ddd'} />
          ),
        }}
        component={CreatorStack}
        name="Creator"
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({focused}) => <CustomAccountIcon focused={focused} />,
        }}
        component={AccountStack}
        name="Account"
      />
    </Tab.Navigator>
  );
};

export default HomeTab;
