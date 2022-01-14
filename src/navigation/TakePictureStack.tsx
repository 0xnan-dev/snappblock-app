import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { CameraScreen, EditingScreen } from '../screens';

import { TakePictureParamList } from '../types/navigation';

const TakePicture = createNativeStackNavigator<TakePictureParamList>();

export function TakePictureNavigator() {
  return (
    <TakePicture.Navigator>
      <TakePicture.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
      <TakePicture.Screen
        name="Editing"
        options={{
          title: 'New Post',
          headerTitleAlign: 'center',
        }}
        component={EditingScreen}
      />
    </TakePicture.Navigator>
  );
}
