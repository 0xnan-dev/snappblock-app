import React, { FC } from 'react';
import { Button, Text, Box, View } from 'native-base';

export interface GenerateWalletViewProps {
  onSubmit: () => void;
}
export const GenerateWalletView: FC<GenerateWalletViewProps> = ({
  onSubmit,
}) => {
  return (
    <View>
      <Text mb={8}>
        Make sure no one is watching the screen, while the seed phrase is
        visible.
      </Text>
      <Box mt="auto">
        <Button onPress={onSubmit}>Generate Wallet</Button>
      </Box>
    </View>
  );
};
