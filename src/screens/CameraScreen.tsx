import { Factory, Icon, Text, View, IconButton, Box, Flex } from 'native-base';
import {
  SimpleLineIcons,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import React, { useEffect, ComponentProps, FC, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import { Dimensions, Platform } from 'react-native';
import { useAppState } from '../hooks';
import { TakePictureScreenProps } from '../types';

const StyledIconButton: FC<ComponentProps<typeof IconButton>> = props => (
  <IconButton
    variant="unstyled"
    _icon={{
      color: 'white',
      size: 'sm',
    }}
    _hover={{
      bg: 'primary.600:alpha.20',
    }}
    textAlign="center"
    {...props}
  />
);

const ToolBar: FC<ComponentProps<typeof Flex>> = ({ children, ...props }) => {
  return (
    <Flex
      flex="1 0 100px"
      flexDirection="row"
      backgroundColor="black"
      justifyContent="space-between"
      alignItems="center"
      px={4}
      {...props}
    >
      {children}
    </Flex>
  );
};

export const CameraScreen: FC<TakePictureScreenProps> = ({ navigation }) => {
  const { setPicture } = useAppState();
  const [hasPermission, setHasPermission] = useState(false);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isRatioSet, setIsRatioSet] = useState(false);
  const [imagePadding, setImagePadding] = useState(0);
  const { height, width } = Dimensions.get('window');
  const screenRatio = height / width;
  const [ratio, setRatio] = useState('4:3'); // default is 4:3
  const [flashModeIcon, setFlashModeIcon] = useState<
    'flash-auto' | 'flash-off' | 'flash-on'
  >('flash-auto');
  const [type, setType] = useState(Camera.Constants.Type.back);
  const FactoryCamera = Factory(Camera);
  const cameraRef = useRef<Camera>();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();

      setHasPermission(status === 'granted');
    })();
  }, []);

  const prepareRatio = async () => {
    let desiredRatio = '4:3'; // Start with the system default
    // This issue only affects Android

    if (Platform.OS === 'android') {
      const ratios = (await cameraRef.current?.getSupportedRatiosAsync()) || [];

      // Calculate the width/height of each of the supported camera ratios
      // These width/height are measured in landscape mode
      // find the ratio that is closest to the screen ratio without going over
      const distances = {} as Record<string, number>;
      const realRatios = {} as Record<string, number>;
      let minDistance: string | null = null;

      for (const r of ratios) {
        const parts = r.split(':');
        const realRatio = parseInt(parts[0], 10) / parseInt(parts[1], 10);

        realRatios[ratio] = realRatio;
        // ratio can't be taller than screen, so we don't want an abs()
        const distance = screenRatio - realRatio;

        distances[ratio] = realRatio;
        if (minDistance === null) {
          minDistance = ratio;
        } else {
          if (distance >= 0 && distance < distances[minDistance]) {
            minDistance = ratio;
          }
        }
      }

      if (!minDistance) {
        return;
      }

      // set the best match
      desiredRatio = minDistance;
      //  calculate the difference between the camera width and the screen height
      const remainder = Math.floor(
        (height - realRatios[desiredRatio] * width) / 2
      );
      // set the preview padding and preview ratio

      setImagePadding(remainder);
      setRatio(desiredRatio);
      // Set a flag so we don't do this
      // calculation each time the screen refreshes
      setIsRatioSet(true);
    }
  };

  const handleOnTypeChange = () => {
    setType(t =>
      t === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const handleOnFlashModeChange = () => {
    setFlashMode(m => {
      if (m === Camera.Constants.FlashMode.auto) {
        return Camera.Constants.FlashMode.off;
      }

      return m === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.on
        : Camera.Constants.FlashMode.auto;
    });
  };

  const handleBackToGallery = async () => {
    navigation.navigate('Main', { screen: 'Gallery' });
  };

  // the camera must be loaded in order to access the supported ratios
  const handleOnCameraReady = async () => {
    setIsCameraReady(true);

    if (!isRatioSet) {
      await prepareRatio();
    }
  };

  const handleTakePicture = async () => {
    // must wait for camera ready
    if (isCameraReady && cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync();

      setPicture(data);

      navigation.push('Editing');
    }
  };

  useEffect(() => {
    if (flashMode === Camera.Constants.FlashMode.auto) {
      setFlashModeIcon('flash-auto');
    } else if (flashMode === Camera.Constants.FlashMode.off) {
      setFlashModeIcon('flash-off');
    } else if (flashMode === Camera.Constants.FlashMode.on) {
      setFlashModeIcon('flash-on');
    }
  }, [flashMode]);

  if (hasPermission === null) {
    return <View />;
  }

  return (
    <View p={0}>
      <FactoryCamera
        onCameraReady={handleOnCameraReady}
        my={imagePadding}
        ref={cameraRef}
        flex={1}
        flashMode={flashMode}
        ratio={ratio}
        useCamera2Api={true}
        type={type}
      >
        <ToolBar flex="1 0 48px">
          <Box>
            <StyledIconButton
              onPress={() => handleOnFlashModeChange()}
              icon={<Icon as={<MaterialIcons name={flashModeIcon} />} />}
            />
          </Box>
        </ToolBar>

        <Box flex="1 1 100%" backgroundColor="transparent">
          {hasPermission === false ? (
            <View
              justifyContent="center"
              alignItems="center"
              backgroundColor="rgba(0,0,0,0.75)"
            >
              <Text color="white">No access to camera</Text>
            </View>
          ) : null}
        </Box>

        <ToolBar flex="1 0 72px">
          <Box>
            <StyledIconButton
              onPress={() => {
                handleBackToGallery();
              }}
              icon={<Icon as={<SimpleLineIcons name="picture" />} />}
            />
          </Box>
          <Box>
            <StyledIconButton
              _icon={{
                size: '64px',
                color: 'white',
              }}
              onPress={() => handleTakePicture()}
              icon={
                <Icon as={<MaterialCommunityIcons name="circle-slice-8" />} />
              }
            />
          </Box>
          <Box>
            <StyledIconButton
              onPress={() => handleOnTypeChange()}
              icon={<Icon as={<SimpleLineIcons name="refresh" />} />}
            />
          </Box>
        </ToolBar>
      </FactoryCamera>
    </View>
  );
};
