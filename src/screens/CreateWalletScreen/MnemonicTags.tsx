import React, { FC } from 'react';
import {
  useToast,
  Pressable,
  Box,
  Text,
  Flex,
  useClipboard,
} from 'native-base';

export interface MnemonicTagsProps extends React.ComponentProps<typeof Box> {
  mnemonic: string;
}

export const MnemonicTags: FC<MnemonicTagsProps> = ({ mnemonic, ...props }) => {
  const { onCopy } = useClipboard();
  const toast = useToast();

  const handleOnCopy = () => {
    onCopy(mnemonic);

    toast.show({
      description: 'Copied!',
    });
  };

  return (
    <Box {...props}>
      <Pressable onPress={handleOnCopy}>
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
      </Pressable>
    </Box>
  );
};
