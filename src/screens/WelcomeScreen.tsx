import React, { FC } from 'react';
import { Box, View, Button, Text } from 'native-base';
import { WelcomeStackParamList } from '../types';
import { StackScreenProps } from '@react-navigation/stack';
import { AppIcon, Modal, useModal, ModalProps } from '../components';
import { useAppState } from '../hooks';

const UnlockModal: FC<ModalProps> = props => <Modal {...props} />;

export const WelcomeScreen: FC<
  StackScreenProps<WelcomeStackParamList, 'Welcome'>
> = ({ navigation }) => {
  const { hasStoredWallet } = useAppState();
  const unlockModalProps = useModal();

  return (
    <View alignItems="center" paddingTop={16}>
      <Box w="180pt" mb={4}>
        <AppIcon height="100%" width="100%" />
      </Box>
      <Box mb={4}>
        <Text fontSize="5xl">Welcome</Text>
        <Text>Let's start with generating a wallet.</Text>
      </Box>

      <Box w="100%" mt="auto">
        <Button
          w="100%"
          mb={4}
          colorScheme="primary"
          onPress={() => navigation.navigate('CreateWallet')}
        >
          New Wallet
        </Button>
        {hasStoredWallet && (
          <Button colorScheme="primary" onPress={() => unlockModalProps.show()}>
            Unlock Wallet
          </Button>
        )}
        <Button
          colorScheme="gray"
          w="100%"
          onPress={() => navigation.navigate('RestoreWallet')}
        >
          Import
        </Button>
      </Box>

      <UnlockModal {...unlockModalProps} />
    </View>
  );
};
