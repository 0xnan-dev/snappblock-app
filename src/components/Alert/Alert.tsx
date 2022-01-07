import React, { FC } from 'react';
import {
  Alert as BaseAlert,
  Collapse,
  VStack,
  HStack,
  IconButton,
  CloseIcon,
  Box,
  Text,
  IAlertProps,
} from 'native-base';
import { UseAlertProps } from './UseAlertContext';

export const Alert: FC<UseAlertProps & IAlertProps> = ({
  title,
  close,
  isOpen,
  message,
}) => {
  return (
    <Collapse isOpen={isOpen}>
      <BaseAlert w="100%" status="error">
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
              onPress={() => close()}
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
    </Collapse>
  );
};
