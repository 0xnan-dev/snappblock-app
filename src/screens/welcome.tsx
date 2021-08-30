import React from 'react';
import {Box, Button, Text} from 'native-base';

const WelcomeScreen = ({navigation}) => {
  return (
    <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
      <Text fontSize="6xl">Welcome</Text>
      <Text>Let's start with creating a wallet.</Text>
      <Button
        colorScheme="success"
        onPress={() => navigation.navigate('Import Seed Phrase')}>
        Import Seed Phrase
      </Button>
    </Box>
  );
};
export default WelcomeScreen;
