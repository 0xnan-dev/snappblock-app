import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Flex,
  PresenceTransition,
  View,
  Button,
  VStack,
  useDisclose,
  Icon,
} from 'native-base';
import { StackScreenProps } from '@react-navigation/stack';
import { WelcomeStackParamList } from '../types/navigation';
import { AppIcon, UnlockModal } from '../components';
import { useAppState } from '../hooks';

export const WelcomeScreen: FC<
  StackScreenProps<WelcomeStackParamList, 'Welcome'>
> = ({ navigation }) => {
  const unlockModalProps = useDisclose();
  const { decryptWallet, hasStoredWallet, storedWalletName } = useAppState();
  const [showLogo, setShowLogo] = useState(false);

  const handleOnUnlock = async ({ password }: { password: string }) => {
    await decryptWallet(password);

    unlockModalProps.onClose();
  };

  useEffect(() => {
    setTimeout(() => {
      setShowLogo(true);
    }, 750);
  }, []);

  useEffect(() => {
    if (hasStoredWallet && !unlockModalProps.isOpen) {
      unlockModalProps.onOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStoredWallet]);

  return (
    <View>
      <VStack alignItems="center" flex={1} justifyContent="space-between">
        <Flex
          alignItems="center"
          h="50%"
          justifyContent="center"
          mb={4}
          w="100%"
        >
          <PresenceTransition
            animate={{
              opacity: 1,
              translateY: 0,
              transition: {
                duration: 750,
              },
            }}
            initial={{ opacity: 0, translateY: 25 }}
            visible={showLogo}
          >
            <Box alignItems="center" flex={1} justifyContent="center">
              <Icon as={<AppIcon />} size={220} />
              <Heading color="primary.500">Snappblock</Heading>
            </Box>
          </PresenceTransition>
        </Flex>

        <VStack h="50%" justifyContent="center" space={4} w="100%">
          <Button
            _text={{
              color: 'primary.500',
            }}
            colorScheme="primary.200:alpha.30"
            w="100%"
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
              _text={{
                color: 'primary',
              }}
              variant="unstyled"
              w="100%"
              onPress={() => unlockModalProps.onOpen()}
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
