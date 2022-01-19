import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TransitionPresets } from '@react-navigation/stack';
import * as React from 'react';
import { CameraScreen, EditingScreen } from '../screens';

import { TakePictureParamList } from '../types/navigation';

const TakePicture = createNativeStackNavigator<TakePictureParamList>();

export function TakePictureNavigator() {
  return (
    <TakePicture.Navigator>
      <TakePicture.Screen
        component={CameraScreen}
        name="Camera"
        options={{ headerShown: false }}
      />
      <TakePicture.Screen
        component={EditingScreen}
        name="Editing"
        options={{
          title: 'New Post',
          headerTitleAlign: 'center',
        }}
      />
    </TakePicture.Navigator>
  );
}
