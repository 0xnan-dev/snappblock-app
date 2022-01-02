import React, { FC } from 'react';
import { Box, Button, Text } from 'native-base';
import { WelcomeStackParamList } from '../types';
import { StackScreenProps } from '@react-navigation/stack';
import LogoIcon from '../../assets/images/icon.svg';

export const WelcomeScreen: FC<
  StackScreenProps<WelcomeStackParamList, 'Welcome'>
> = ({ navigation }) => {
  return (
    <Box flex={1} bg="#fff" alignItems="center" paddingTop={16}>
      <LogoIcon height="40%" width="80%" />
      <Text fontSize="5xl">Welcome</Text>
      <Text>Let's start with generating a wallet.</Text>
      <Button
        marginY="10px"
        colorScheme="success"
        onPress={() => navigation.navigate('CreateWallet')}
      >
        New Wallet
      </Button>
      <Button
        marginY="10px"
        colorScheme="info"
        onPress={() => navigation.navigate('RestoreWallet')}
      >
        Import
      </Button>
    </Box>
  );
};
