import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  Box,
  Image,
  Text,
  Skeleton,
  VStack,
  Avatar,
  HStack,
  Pressable,
} from 'native-base';
import React, { FC, useState } from 'react';
import { PhotoItem } from '../../interfaces';

dayjs.extend(relativeTime);

export interface PhotoCardProps {
  isLoading?: boolean;
  item: PhotoItem;
  onPress?: () => void;
}

export const PhotoCard: FC<PhotoCardProps> = ({
  onPress,
  item,
  isLoading = false,
}) => {
  const [isImageLoaded, setisImageLoaded] = useState(false);
  const shortenAddress = `${item.fromAddress.slice(
    0,
    8
  )}...${item.fromAddress.slice(-4)}`;
  const dayFrom = dayjs(item.date).fromNow();

  const handleOnLoadEnd = () => {
    setisImageLoaded(true);
  };

  return (
    <Pressable onPress={onPress}>
      <VStack key={item.iscnId} mb={8} px={4} space={2}>
        <Box position="relative">
          {isLoading || !isImageLoaded ? (
            <Skeleton
              h={250}
              left={0}
              position="absolute"
              top={0}
              w="100%"
              zIndex={2}
            />
          ) : null}
          <Image
            alt={item.description}
            h={250}
            resizeMode="cover"
            source={{ uri: item.photo }}
            w="100%"
            onLoadEnd={handleOnLoadEnd}
          />
        </Box>

        <HStack alignItems="center" space={2}>
          <Avatar backgroundColor="primary.500" size="xs" />
          <Text fontSize="sm" fontWeight="bold">
            {shortenAddress}
          </Text>
          <Text color="gray.500" fontSize="sm" ml="auto">
            {dayFrom}
          </Text>
        </HStack>
      </VStack>
    </Pressable>
  );
};
