import React, {FC} from 'react';
import {Box, Button, Text} from 'native-base';
import {MainStackParamList} from '../types';
import {StackScreenProps} from '@react-navigation/stack';

const WelcomeScreen: FC<StackScreenProps<MainStackParamList, 'WelcomeScreen'>> =
  ({navigation}) => {
    return (
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Text fontSize="6xl">Welcome</Text>
        <Text>Let's start with generating a wallet.</Text>
        <Button
          marginY="10px"
          colorScheme="success"
          onPress={() => navigation.navigate('NewWalletScreen')}>
          New Wallet
        </Button>
        <Button
          marginY="10px"
          colorScheme="info"
          onPress={() => navigation.navigate('ImportSeedPhraseScreen')}>
          Import
        </Button>
      </Box>
    );
  };
export default WelcomeScreen;
