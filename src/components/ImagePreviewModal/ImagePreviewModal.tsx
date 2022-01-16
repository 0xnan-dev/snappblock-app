import { Text, Image, Box, Slide, HStack, Avatar, Center } from 'native-base';
import { StyleSheet } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Layout } from '../../constants';

dayjs.extend(relativeTime);

export interface ImagePreviewModalProps {
  isOpen: boolean;
  source?: string;
  description?: string;
  fromAddress?: string;
  publishedDate?: Date;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 99,
  },
});

export const ImagePreviewModal: FC<ImagePreviewModalProps> = ({
  source,
  fromAddress,
  publishedDate,
  description,
  isOpen,
  onClose,
}) => {
  const y = useSharedValue(0);
  const [imageSource, setImageSource] = useState<string | undefined>();
  const clientHeight = Layout.window.height;
  const shortenAddress = fromAddress
    ? `${fromAddress.slice(0, 8)}...${fromAddress.slice(-4)}`
    : '';
  const dayFrom = publishedDate ? dayjs(publishedDate).fromNow() : '';

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startY: number }
  >({
    onStart: (_, ctx) => {
      ctx.startY = y.value;
    },
    onActive: (event, ctx) => {
      y.value = ctx.startY + event.translationY;
    },
    onEnd: (event, ctx) => {
      const delta = ctx.startY + event.translationY;

      if (delta > clientHeight / 3 || delta < -clientHeight / 3) {
        runOnJS(onClose)();
      }

      y.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      y.value,
      [-clientHeight, 0, clientHeight],
      [0.5, 1, 0.5],
      {
        extrapolateRight: Extrapolate.CLAMP,
      }
    );

    return {
      transform: [
        {
          translateY: y.value,
        },
        {
          scale,
        },
      ],
    };
  });

  // show image after animation completed
  useEffect(() => {
    const timeout = setTimeout(() => {
      setImageSource(source);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [source]);

  return (
    <Slide duration={500} in={isOpen}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[animatedStyle, styles.container]}>
          <Center p={4}>
            <HStack alignItems="center" space={2}>
              <Avatar backgroundColor="primary.500" size="xs" />
              <Text color="white" fontSize="sm" fontWeight="bold">
                {shortenAddress}
              </Text>
            </HStack>
            <Text color="gray.500" fontSize="sm">
              {dayFrom}
            </Text>
          </Center>

          {/* XXX: added a empty box here to make <Image /> could correctly display */}
          {imageSource ? (
            <Image
              alt={description || 'No image'}
              flex={1}
              resizeMode="contain"
              source={{ uri: imageSource }}
            />
          ) : (
            <Box flex={1} />
          )}
          <Box p={4}>
            {description ? (
              <Text color="white" textAlign="center">
                {description}
              </Text>
            ) : null}
          </Box>
        </Animated.View>
      </PanGestureHandler>
    </Slide>
  );
};
