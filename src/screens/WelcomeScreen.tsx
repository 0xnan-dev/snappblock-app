import React, { FC } from 'react';
import { Flex, Box, View, Button, Text } from 'native-base';
import { WelcomeStackParamList } from '../types';
import { StackScreenProps } from '@react-navigation/stack';
import { AppIcon, Modal, useModal, ModalProps } from '../components';

const UnlockModal: FC<ModalProps> = props => <Modal {...props} />;

export const WelcomeScreen: FC<
  StackScreenProps<WelcomeStackParamList, 'Welcome'>
> = ({ navigation }) => {
  const unlockModalProps = useModal();

  return (
    <View alignItems="center" paddingTop={16} justifyContent="space-between">
      <Box w="180pt" mb={4} height="50%">
        <AppIcon height="100%" width="100%" />
      </Box>

      <Flex height="50%" justifyContent="center" w="100%">
        <Button
          w="100%"
          mb={4}
          colorScheme="primary.200:alpha.30"
          _text={{
            color: 'primary.500',
          }}
          onPress={() => navigation.navigate('CreateWallet')}
        >
          Create a new Wallet
        </Button>

        <Button
          colorScheme="primary"
          w="100%"
          onPress={() => navigation.navigate('RestoreWallet')}
        >
          Import existing wallet
        </Button>
      </Flex>

      <UnlockModal {...unlockModalProps} />
    </View>
  );
};
