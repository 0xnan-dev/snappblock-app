import React, { FC } from 'react';
import { useToast, useToken, Box, Text, Flex, useClipboard } from 'native-base';
import { TouchableHighlight } from 'react-native';
import { useAlert } from '../../components';

export interface MnemonicTagsProps extends React.ComponentProps<typeof Box> {
  mnemonic: string;
}

export const MnemonicTags: FC<MnemonicTagsProps> = ({ mnemonic, ...props }) => {
  const { onCopy } = useClipboard();
  const { show: showAlert } = useAlert();
  const toast = useToast();
  const [colorPrimary200] = useToken('colors', ['primary.200']);

  const handleOnCopy = () => {
    onCopy(mnemonic);

    toast.show({
      description: 'Copied!',
    });
  };

  return (
    <Box {...props}>
      <TouchableHighlight
        underlayColor={colorPrimary200}
        onPress={handleOnCopy}
      >
        <Flex flexWrap="wrap" flexDirection="row">
          {mnemonic.split(' ').map((phrase, i) => (
            <Box
              mr={2}
              mb={2}
              px={1}
              py={1}
              key={`${i}-${mnemonic}`}
              borderRadius="md"
              backgroundColor="primary.200:alpha.20"
              borderColor="primary.500"
              borderStyle="solid"
              borderWidth="1pt"
            >
              <Text
                fontSize="xs"
                fontWeight="bold"
                color="primary.500"
                selectable
              >
                {i + 1}. {phrase}
              </Text>
            </Box>
          ))}
        </Flex>
      </TouchableHighlight>
    </Box>
  );
};
