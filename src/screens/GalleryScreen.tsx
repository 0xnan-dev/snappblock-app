import { Text, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useAppState } from '../hooks';
import { MainTabScreenProps } from '../types/navigation';

export function GalleryScreen({ navigation }: MainTabScreenProps<'Gallery'>) {
  const { fetchPhotos, photos } = useAppState();
  const [sequence, setSequence] = useState(0);

  useEffect(() => {
    fetchPhotos(sequence);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sequence]);

  console.log(photos);

  return (
    <View>
      <Text>Tab One</Text>
      <View
        _light={{ color: '#eee' }}
        _dark={{ color: 'rgba(255,255,255,0.1)' }}
      />
      <Text>Hello</Text>
    </View>
  );
}
