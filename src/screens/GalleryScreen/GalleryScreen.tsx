import { FlatList, View } from 'native-base';
import React, { FC, useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import { PhotoItem } from '../../interfaces';
import { useAppState } from '../../hooks';
import { GalleryScreenProps } from '../../types';
import { PhotoCard } from './PhotoCard';

const MemorizedPhotoCard = React.memo(PhotoCard);

export const GalleryScreen: FC<GalleryScreenProps<'Gallery'>> = ({
  navigation,
}) => {
  const { setSelectedItem, selectedItem, fetchPhotos, isLoading, photos } =
    useAppState();
  const [sequence, setSequence] = useState(0);

  const refetch = async () => {
    const { nextSequence } = await fetchPhotos(sequence);

    setSequence(nextSequence);
  };

  // fetch photos
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedItem) {
      navigation.push('Photo', { photo: selectedItem });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]);

  return (
    <View px={0}>
      <FlatList<PhotoItem>
        data={photos}
        keyExtractor={item => item.iscnId}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        renderItem={({ item }) => (
          <MemorizedPhotoCard
            isLoading={isLoading}
            item={item}
            onPress={() => {
              setSelectedItem(item);
            }}
          />
        )}
      />
    </View>
  );
};
