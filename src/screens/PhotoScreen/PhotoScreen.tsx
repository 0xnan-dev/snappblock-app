import React, { FC } from 'react';
import { GalleryScreenProps } from '../../types';
import { ImagePreviewModal } from '../../components';

export interface PhotoScreenProps {
  onOpen?: () => void;
  onClose?: () => void;
  isOpen?: boolean;
}

export const PhotoScreen: FC<
  PhotoScreenProps & GalleryScreenProps<'Photo'>
> = ({ navigation, route }) => {
  const selectedItem = route.params.photo;

  const handlePreviewModalClose = () => {
    navigation.goBack();
  };

  return (
    <ImagePreviewModal
      description={selectedItem?.description}
      fromAddress={selectedItem?.fromAddress}
      publishedDate={selectedItem?.date}
      source={selectedItem?.photo}
      onClose={handlePreviewModalClose}
    />
  );
};
