/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { MainStackParamList } from '../types/navigation';

const linking: LinkingOptions<MainStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Welcome: {
        screens: {
          Welcome: {
            screens: {
              Welcome: 'welcome',
            },
          },
          CreateWallet: {
            screens: {
              CreateWallet: 'welcome/createWallet',
            },
          },
          RestoreWallet: {
            screens: {
              RestoreWallet: 'welcome/restoreWallet',
            },
          },
        },
      },
      Main: {
        screens: {
          Gallery: {
            screens: {
              Gallery: 'gallery',
            },
          },
          TakePicture: {
            screens: {
              Camera: 'takePicture/camera',
              Editing: 'takePicture/editing',
            },
          },
          Profile: {
            screens: {
              Profile: 'profile',
            },
          },
        },
      },
    },
  },
};

export default linking;
