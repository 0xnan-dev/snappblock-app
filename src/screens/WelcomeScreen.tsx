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
    <View flex={1} bg="#fff" alignItems="center" paddingTop={16}>
      <Box w="140pt" mb={4}>
        <AppIcon height="100%" width="100%" />
      </Box>
      <Text fontSize="5xl">Welcome</Text>
      <Text>Let's start with generating a wallet.</Text>
      <Button
        mb={4}
        colorScheme="success"
        onPress={() => navigation.navigate('CreateWallet')}
      >
        New Wallet
      </Button>
      {hasStoredWallet && (
        <Button onPress={() => unlockModalProps.show()} colorScheme="success">
          Unlock Wallet
        </Button>
      )}
      <Button onPress={() => navigation.navigate('RestoreWallet')}>
        Import
      </Button>

      <UnlockModal {...unlockModalProps} />
    </View>
  );
};
