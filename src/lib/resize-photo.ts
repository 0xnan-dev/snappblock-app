import { CameraCapturedPicture } from 'expo-camera';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

// eslint-disable-next-line no-shadow
enum PhotoDimensions {
  WIDTH = 'width',
  HEIGHT = 'height',
}

const maximalValuesPerDimension = { width: 800, height: 800 };

export const resizePhoto = async (photo: CameraCapturedPicture) => {
  // 1. define the maximal dimension and the allowed value for it
  const largestDimension =
    photo.width > photo.height ? PhotoDimensions.WIDTH : PhotoDimensions.HEIGHT;
  const initialValueOfLargestDimension = photo[largestDimension];
  const maximalAllowedValueOfLargestDimension =
    maximalValuesPerDimension[largestDimension];
  const targetValueOfLargestDimension =
    initialValueOfLargestDimension > maximalAllowedValueOfLargestDimension
      ? maximalAllowedValueOfLargestDimension
      : initialValueOfLargestDimension;

  // 2. resize the photo w/ that target value for that dimension (keeping the aspect ratio)
  const resizedPhoto = await manipulateAsync(
    photo.uri,
    [{ resize: { [largestDimension]: targetValueOfLargestDimension } }],
    { compress: 0.7, format: SaveFormat.JPEG }
  );

  // 3. return the resized photo
  return resizedPhoto;
};
