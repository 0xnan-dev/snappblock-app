import { FlatList, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { PhotoItem } from '../../interfaces';
import { useAppState } from '../../hooks';
import { PhotoCard } from './PhotoCard';

const MemorizedPhotoCard = React.memo(PhotoCard);

export function GalleryScreen() {
  const { setSelectedItem, fetchPhotos, isLoading, photos } = useAppState();
  const [sequence, setSequence] = useState(0);

  // fetch photos
  useEffect(() => {
    (async function () {
      const { nextSequence } = await fetchPhotos(sequence);

      setSequence(nextSequence);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View>
      <FlatList<PhotoItem>
        data={photos}
        keyExtractor={item => item.iscnId}
        renderItem={({ item }) => (
          <MemorizedPhotoCard
            onPress={() => setSelectedItem(item)}
            item={item}
            isLoading={isLoading}
          />
        )}
      />
    </View>
  );
}
