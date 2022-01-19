import { Ionicons } from '@expo/vector-icons';
import {
  Text,
  FormControl,
  Image,
  Box,
  TextArea,
  WarningOutlineIcon,
  Icon,
  VStack,
  HStack,
  View,
  useDisclose,
  useToast,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import BigNumber from 'bignumber.js';
import { useAppState } from '../hooks';
import { TakePictureScreenProps } from '../types/navigation';
import { Modal } from '../components';

const CHAR_LIMIT = 120;

export interface EditingFormType {
  message: string;
}

export function EditingScreen({
  navigation,
}: TakePictureScreenProps<'Editing'>) {
  const { fetchPhotos, balance, picture, isLoading, upload } = useAppState();
  const toast = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const { formState, control, watch, handleSubmit } =
    useForm<EditingFormType>();
  const { errors } = formState;
  const [messageText] = watch(['message']);
  const uploadModalProps = useDisclose();
  const isBalanceSufficent =
    balance && balance.isGreaterThan(new BigNumber('10000'));

  const handleUpload = async (data: EditingFormType) => {
    if (!picture) {
      return;
    }

    setIsUploading(true);

    try {
      const txn = await upload(picture, data.message);

      if (txn) {
        uploadModalProps.onClose();

        await fetchPhotos(0);

        navigation.navigate('Gallery');
      }
    } catch (ex) {
      console.error(ex);

      toast.show({
        placement: 'top',
        title: 'Something went wrong, please try again later',
        status: 'error',
      });
    }

    setIsUploading(false);
  };

  useEffect(() => {
    if (!picture) {
      navigation.navigate('Camera');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picture]);

  useEffect(() => {
    setTimeout(() => {
      uploadModalProps.onOpen();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!picture) {
    return null;
  }

  return (
    <View flex={1} p={0}>
      <Image alt="photo" h="100%" size="full" source={picture} w="100%" />

      <Modal
        closeOnOverlayClick={false}
        disabled={isLoading || isUploading}
        okButtonProps={{
          isLoading: isLoading || isUploading,
          leftIcon: (
            <Icon as={Ionicons} name="cloud-upload-outline" size="sm" />
          ),
        }}
        okText="Upload"
        title="New Post"
        onClickCancel={() => {
          navigation.goBack();
        }}
        onClickOk={handleSubmit(handleUpload)}
        {...uploadModalProps}
        onClose={() => {
          navigation.goBack();
          uploadModalProps.onClose();
        }}
      >
        <VStack space={4}>
          {!isBalanceSufficent ? (
            <HStack>
              <WarningOutlineIcon color="red.500" mr={1} mt={1} size="xs" />
              <Text color="red.500" fontSize="sm">
                Your account does not have sufficent balance for gas fee!
              </Text>
            </HStack>
          ) : null}

          <Box>
            <FormControl
              flex={1}
              isInvalid={Boolean(errors.message)}
              isRequired
            >
              <Controller
                control={control}
                name="message"
                render={({ field: { onChange, value } }) => (
                  <TextArea
                    defaultValue={value}
                    flex={1}
                    isDisabled={!isBalanceSufficent || isLoading || isUploading}
                    maxLength={CHAR_LIMIT}
                    placeholder="Message"
                    onChangeText={val => onChange(val)}
                  />
                )}
              />
              {errors.message && (
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {errors.message.message}
                </FormControl.ErrorMessage>
              )}
            </FormControl>
            <Text color="gray.500" fontSize="xs" textAlign="right">
              {(messageText || '').length} / {CHAR_LIMIT}
            </Text>
          </Box>
        </VStack>
      </Modal>
    </View>
  );
}
