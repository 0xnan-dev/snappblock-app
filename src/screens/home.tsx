import React from 'react';
import {Box, Button} from 'native-base';

const HomeScreen = ({navigation}) => {
  return (
    <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
      <Button
        marginY="10px"
        colorScheme="primary"
        onPress={() => navigation.navigate('Snap Shot')}>
        Take Photo
      </Button>
    </Box>
  );
};
export default HomeScreen;
