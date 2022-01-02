import {Dimensions} from 'react-native';

export const STATUS_BAR_HEIGHT: number = 0; //getStatusBarHeight();
export const SCREEN_HEIGHT: number = Math.round(
  Dimensions.get('window').height,
);
export const SCREEN_WIDTH: number = Math.round(Dimensions.get('window').width);
