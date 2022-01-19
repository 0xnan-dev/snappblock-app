import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { GalleryScreen, PhotoScreen } from '../screens';

import { GalleryParamList } from '../types/navigation';

const Gallery = createNativeStackNavigator<GalleryParamList>();

export function GalleryNavigator() {
  return (
    <Gallery.Navigator>
      <Gallery.Screen
        component={GalleryScreen}
        name="Gallery"
        options={{ headerTitleAlign: 'center' }}
      />
      <Gallery.Screen
        component={PhotoScreen}
        name="Photo"
        options={{
          title: 'Photo',
          headerTitleAlign: 'center',
        }}
      />
    </Gallery.Navigator>
  );
}
