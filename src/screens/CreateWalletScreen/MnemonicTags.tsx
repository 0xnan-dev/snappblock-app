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
      placement: 'top',
      description: 'Copied!',
      status: 'success',
    });
  };

  return (
    <Box {...props}>
      <Pressable onPress={handleOnCopy}>
        <Flex flexDirection="row" flexWrap="wrap">
          {mnemonic.split(' ').map((phrase, i) => (
            <Box
              key={`${i}-${mnemonic}`}
              backgroundColor="primary.200:alpha.20"
              borderColor="primary.500"
              borderRadius="md"
              borderStyle="solid"
              borderWidth={1}
              mb={2}
              mr={2}
              px={1}
              py={1}
            >
              <Text
                color="primary.500"
                fontSize="xs"
                fontWeight="bold"
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
