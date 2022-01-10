/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { MainStackParamList } from '../types';

const linking: LinkingOptions<MainStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Main: {
        screens: {
          Gallery: {
            screens: {
              GalleryScreen: 'gallery',
            },
          },
          Camera: {
            screens: {
              CameraScreen: 'camera',
            },
          },
          Profile: {
            screens: {
              ProfileScreen: 'profile',
            },
          },
        },
      },
    },
  },
};

export default linking;
