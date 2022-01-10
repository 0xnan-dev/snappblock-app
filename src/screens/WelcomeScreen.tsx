import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Flex,
  PresenceTransition,
  View,
  Button,
} from 'native-base';
import { WelcomeStackParamList } from '../types';
import { StackScreenProps } from '@react-navigation/stack';
import { AppIcon, Modal, useModal, ModalProps } from '../components';

const UnlockModal: FC<ModalProps> = props => <Modal {...props} />;

export const WelcomeScreen: FC<
  StackScreenProps<WelcomeStackParamList, 'Welcome'>
> = ({ navigation }) => {
  const unlockModalProps = useModal();
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowLogo(true);
    }, 750);
  }, []);

  return (
    <View alignItems="center" paddingTop={16} justifyContent="space-between">
      <Flex
        alignItems="center"
        justifyContent="center"
        w="100%"
        mb={4}
        height="50%"
      >
        <PresenceTransition
          visible={showLogo}
          initial={{ opacity: 0, translateY: 100 }}
          animate={{
            opacity: 1,
            translateY: 0,
            transition: {
              duration: 750,
            },
          }}
        >
          <Box flex={1} alignItems="center" justifyContent="center">
            <AppIcon height="120pt" width="180pt" />
            <Heading color="primary.500">Snappblock</Heading>
          </Box>
        </PresenceTransition>
      </Flex>

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
