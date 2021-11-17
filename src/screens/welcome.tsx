import React from 'react';
import {Box, Button, Text} from 'native-base';

const WelcomeScreen = ({navigation}) => {
  return (
    <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
      <Text fontSize="6xl">Welcome</Text>
      <Text>Let's start with generating a wallet.</Text>
      <Button
        marginY="10px"
        colorScheme="success"
        onPress={() => navigation.navigate('Seed Phrase')}>
        New Wallet
      </Button>
      <Button
        marginY="10px"
        colorScheme="info"
        onPress={() => navigation.navigate('Import Seed Phrase')}>
        Import
      </Button>
    </Box>
  );
};
export default WelcomeScreen;
