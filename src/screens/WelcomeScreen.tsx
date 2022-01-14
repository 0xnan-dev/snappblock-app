import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Flex,
  PresenceTransition,
  View,
  Button,
  VStack,
} from 'native-base';
import { StackScreenProps } from '@react-navigation/stack';
import { WelcomeStackParamList } from '../types/navigation';
import { AppIcon, UnlockModal, useModal } from '../components';
import { useAppState } from '../hooks';

export const WelcomeScreen: FC<
  StackScreenProps<WelcomeStackParamList, 'Welcome'>
> = ({ navigation }) => {
  const unlockModalProps = useModal();
  const { decryptWallet, hasStoredWallet, storedWalletName } = useAppState();
  const [showLogo, setShowLogo] = useState(false);

  const handleOnUnlock = async ({ password }: { password: string }) => {
    await decryptWallet(password);

    unlockModalProps.close();
  };

  useEffect(() => {
    setTimeout(() => {
      setShowLogo(true);
    }, 750);
  }, []);

  useEffect(() => {
    if (hasStoredWallet && !unlockModalProps.isOpen) {
      unlockModalProps.show();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStoredWallet]);

  return (
    <View>
      <VStack flex={1} alignItems="center" justifyContent="space-between">
        <Flex
          alignItems="center"
          justifyContent="center"
          w="100%"
          mb={4}
          h="50%"
        >
          <PresenceTransition
            visible={showLogo}
            initial={{ opacity: 0, translateY: 25 }}
            animate={{
              opacity: 1,
              translateY: 0,
              transition: {
                duration: 750,
              },
            }}
          >
            <Box flex={1} alignItems="center" justifyContent="center">
              <AppIcon h="120pt" width="180pt" />
              <Heading color="primary.500">Snappblock</Heading>
            </Box>
          </PresenceTransition>
        </Flex>

        <VStack space={4} h="50%" justifyContent="center" w="100%">
          <Button
            w="100%"
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

          {hasStoredWallet ? (
            <Button
              variant="unstyled"
              _text={{
                color: 'primary',
              }}
              w="100%"
              onPress={() => unlockModalProps.show()}
            >
              Unlock Wallet
            </Button>
          ) : null}
        </VStack>
      </VStack>

      <UnlockModal
        walletName={storedWalletName || 'Unknown'}
        onSubmit={handleOnUnlock}
        {...unlockModalProps}
      />
    </View>
  );
};
