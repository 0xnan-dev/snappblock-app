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
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import BigNumber from 'bignumber.js';
import { useAppState } from '../hooks';
import { TakePictureScreenProps } from '../types/navigation';
import { Modal, useModal } from '../components';

export interface EditingFormType {
  message: string;
}

export function EditingScreen({ navigation }: TakePictureScreenProps) {
  const { fetchPhotos, balance, setAlert, picture, isLoading, upload } =
    useAppState();
  const [isUploading, setIsUploading] = useState(false);
  const { formState, control, watch, handleSubmit } =
    useForm<EditingFormType>();
  const { errors } = formState;
  const [messageText] = watch(['message']);
  const uploadModalProps = useModal();
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
        uploadModalProps.close();

        await fetchPhotos(0);

        setTimeout(() => {
          navigation.navigate('Gallery');
        }, 2000);
      }
    } catch (ex) {
      console.debug(ex);

      setAlert({
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
      uploadModalProps.show();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!picture) {
    return null;
  }

  return (
    <>
      <Image size="full" source={picture} />

      <Modal
        title="New Post"
        okText="Upload"
        onClose={() => {
          navigation.goBack();
        }}
        onClickOk={handleSubmit(handleUpload)}
        onClickCancel={() => {
          navigation.goBack();
        }}
        okButtonProps={{
          isLoading: isLoading || isUploading,
          disabled: !isBalanceSufficent,
          leftIcon: (
            <Icon as={Ionicons} name="cloud-upload-outline" size="sm" />
          ),
        }}
        cancelButtonProps={{
          disabled: isLoading || isUploading,
        }}
        closeOnOverlayClick={false}
        {...uploadModalProps}
      >
        <VStack space={4}>
          {!isBalanceSufficent ? (
            <HStack>
              <WarningOutlineIcon mt={1} mr={1} size="xs" color="red.500" />
              <Text fontSize="sm" color="red.500">
                Your account does not have sufficent balance for gas fee!
              </Text>
            </HStack>
          ) : null}

          <Box>
            <FormControl
              flex={1}
              isRequired
              isInvalid={Boolean(errors.message)}
            >
              <Controller
                control={control}
                name="message"
                render={({ field: { onChange, value } }) => (
                  <TextArea
                    flex={1}
                    isDisabled={!isBalanceSufficent || isLoading || isUploading}
                    defaultValue={value}
                    onChangeText={val => onChange(val)}
                    placeholder="Message"
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
            <Text color="gray.500" textAlign="right" fontSize="xs">
              {(messageText || '').length} / 200
            </Text>
          </Box>
        </VStack>
      </Modal>
    </>
  );
}
