/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface MainParamList extends MainStackParamList {}
  }
}

export type TakePictureParamList = {
  Camera: undefined;
  Editing: undefined;
};

export type MainStackScreenProps<Screen extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, Screen>;

export type MainTabParamList = {
  Gallery: undefined;
  TakePicture: NavigatorScreenParams<TakePictureParamList> | undefined;
  Profile: undefined;
};

export type MainTabScreenProps<Screen extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, Screen>,
    NativeStackScreenProps<MainStackParamList>
  >;

export type WelcomeStackParamList = {
  Welcome: undefined;
  CreateWallet: undefined;
  RestoreWallet: undefined;
};

export type MainStackParamList = {
  Welcome: NavigatorScreenParams<WelcomeStackParamList> | undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
};

export type TakePictureScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'TakePicture'>,
  CompositeScreenProps<
    NativeStackScreenProps<MainStackParamList>,
    NativeStackScreenProps<TakePictureParamList>
  >
>;
