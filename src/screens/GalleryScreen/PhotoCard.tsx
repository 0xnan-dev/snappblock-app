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
import React, { memo, useState } from 'react';
import { PhotoItem } from '../../interfaces';

dayjs.extend(relativeTime);

export interface PhotoCardProps {
  isLoading?: boolean;
  item: PhotoItem;
  onPress?: () => void;
}

export const PhotoCard = memo<PhotoCardProps>(
  ({ onPress, item, isLoading = false }) => {
    const [IsImageLoaded, setIsImageLoaded] = useState(false);
    const shortenAddress = `${item.fromAddress.slice(
      0,
      8
    )}...${item.fromAddress.slice(-4)}`;
    const dayFrom = dayjs(item.date).fromNow();

    const handleOnLoadEnd = () => {
      setIsImageLoaded(true);
    };

    return (
      <Pressable onPress={onPress}>
        <VStack mb={8} space={2} key={item.iscnId}>
          <Box position="relative">
            {isLoading || !IsImageLoaded ? (
              <Skeleton
                zIndex={2}
                w="100%"
                h={250}
                position="absolute"
                top={0}
                left={0}
              />
            ) : null}
            <Image
              alt={item.description}
              onLoadEnd={handleOnLoadEnd}
              w="100%"
              h={250}
              resizeMode="cover"
              source={{ uri: item.photo }}
            />
          </Box>

          <HStack space={2} alignItems="center">
            <Avatar bg="primary.500" size="xs" />
            <Text fontSize="sm" fontWeight="bold">
              {shortenAddress}
            </Text>
            <Text ml="auto" fontSize="sm" color="gray.500">
              {dayFrom}
            </Text>
          </HStack>
        </VStack>
      </Pressable>
    );
  }
);
