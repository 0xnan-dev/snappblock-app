import React, { FC, useEffect } from 'react';
import {
  Alert as BaseAlert,
  VStack,
  HStack,
  IconButton,
  CloseIcon,
  Box,
  Text,
  IAlertProps,
  Slide,
} from 'native-base';
import { UseAlertProps } from './UseAlertContext';

export interface AlertProps extends UseAlertProps, IAlertProps {
  title: string;
  autoClose?: number;
  message?: string;
  status?: IAlertProps['status'];
}

export const Alert: FC<AlertProps> = ({
  title,
  close,
  isOpen,
  message,
  autoClose = 6000,
  status = 'info',
}) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      close();
    }, autoClose);

    return () => {
      clearTimeout(timeout);
    };
  }, [autoClose, close]);

  return (
    <Slide in={isOpen} placement="top">
      <BaseAlert w="100%" status={status}>
        <VStack space={1} flexShrink={1} w="100%">
          <HStack
            flexShrink={1}
            space={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack flexShrink={1} space={2} alignItems="center">
              <BaseAlert.Icon />
              <Text
                fontSize="md"
                fontWeight="medium"
                _dark={{
                  color: 'coolGray.800',
                }}
              >
                {title}
              </Text>
            </HStack>
            <IconButton
              variant="unstyled"
              icon={<CloseIcon size="3" color="coolGray.600" />}
              onPress={() => {
                close();
              }}
            />
          </HStack>
          {message && (
            <Box
              pl="6"
              _dark={{
                _text: {
                  color: 'coolGray.600',
                },
              }}
            >
              {message}
            </Box>
          )}
        </VStack>
      </BaseAlert>
    </Slide>
  );
};
