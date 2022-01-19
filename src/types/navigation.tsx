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
import { PhotoItem } from '../interfaces';

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

export type TakePictureScreenProps<Screen extends keyof TakePictureParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, 'TakePicture'>,
    CompositeScreenProps<
      NativeStackScreenProps<MainStackParamList>,
      NativeStackScreenProps<TakePictureParamList, Screen>
    >
  >;

export type GalleryParamList = {
  Gallery: undefined;
  Photo: {
    photo: PhotoItem;
  };
};

export type GalleryScreenProps<Screen extends keyof GalleryParamList> =
  CompositeScreenProps<
    CompositeScreenProps<
      NativeStackScreenProps<GalleryParamList, Screen>,
      NativeStackScreenProps<MainStackParamList>
    >,
    BottomTabScreenProps<MainTabParamList, 'Gallery'>
  >;

export type MainTabParamList = {
  Gallery: NavigatorScreenParams<GalleryParamList> | undefined;
  TakePicture: NavigatorScreenParams<TakePictureParamList> | undefined;
  Profile: undefined;
};
