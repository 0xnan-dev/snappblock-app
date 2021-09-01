import React from 'react';
import {Box, Button, Text} from 'native-base';

const WelcomeScreen = ({navigation}) => {
  return (
    <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
      <Text fontSize="6xl">Welcome</Text>
      <Text>Let's start with generating a wallet.</Text>
      <Button
        colorScheme="success"
        onPress={() => navigation.navigate('Seed Phrase')}>
        New Wallet
      </Button>
      <Button
        colorScheme="info"
        onPress={() => navigation.navigate('Import Seed Phrase')}>
        Import
      </Button>
    </Box>
  );
};
export default WelcomeScreen;
