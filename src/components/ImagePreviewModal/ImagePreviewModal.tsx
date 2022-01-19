import { Text, Image, Box, HStack, Avatar, Center, Spinner } from 'native-base';
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
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Layout } from '../../constants';

dayjs.extend(relativeTime);

export interface ImagePreviewModalProps {
  source?: string;
  description?: string;
  fromAddress?: string;
  publishedDate?: Date;
  onClose: () => void;
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

const LoadingImage: FC = () => (
  <Box h="100%" left={0} position="absolute" top={0} w="100%">
    <Center flex={1}>
      <Spinner accessibilityLabel="Loading photo" size="lg" />
    </Center>
  </Box>
);

export const ImagePreviewModal: FC<ImagePreviewModalProps> = ({
  source,
  fromAddress,
  publishedDate,
  description,
  onClose,
}) => {
  const [show, setShow] = useState(true);
  const [imageSource, setImageSource] = useState<string | undefined>();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const clientHeight = Layout.window.height;
  const y = useSharedValue(clientHeight);
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

      if (delta > clientHeight / 4 || delta < -clientHeight / 4) {
        runOnJS(setShow)(false);
      } else {
        y.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      y.value,
      [-clientHeight, 0, clientHeight],
      [0.25, 1, 0.25],
      {
        extrapolateRight: Extrapolate.CLAMP,
      }
    );
    const opacity = interpolate(
      y.value,
      [-clientHeight, 0, clientHeight],
      [0, 1, 0],
      {
        extrapolateRight: Extrapolate.CLAMP,
      }
    );

    return {
      opacity,
      transform: [
        // {
        //   translateY: y.value,
        // },
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

  useEffect(() => {
    if (show) {
      y.value = withTiming(0, {
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      y.value = withTiming(
        clientHeight,
        {
          duration: 250,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        },
        () => {
          onClose();
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
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

        {imageSource ? (
          <Image
            alt={description || 'No image'}
            flex={1}
            resizeMode="contain"
            source={{ uri: imageSource }}
            onLoadEnd={() => setIsImageLoaded(true)}
          />
        ) : null}

        {!isImageLoaded ? <LoadingImage /> : null}
        <Box mb={8} p={4}>
          {description ? (
            <Text color="white" textAlign="center">
              {description}
            </Text>
          ) : null}
        </Box>
      </Animated.View>
    </PanGestureHandler>
  );
};
