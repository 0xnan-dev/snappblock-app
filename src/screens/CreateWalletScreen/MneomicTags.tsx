import React, { FC } from 'react';
import { useToken, Box, Text, Flex, useClipboard } from 'native-base';
import { useAlert } from '../../components';
import { TouchableHighlight } from 'react-native';

export interface MnemonicTagsProps extends React.ComponentProps<typeof Flex> {
  mnemonic: string;
}

export const MnemonicTags: FC<MnemonicTagsProps> = ({ mnemonic, ...props }) => {
  const { onCopy } = useClipboard();
  const { show: showAlert } = useAlert();
  const [colorPrimary200] = useToken('colors', ['primary.200']);

  const handleOnCopy = () => {
    onCopy(mnemonic);

    showAlert({
      title: 'Phrases has been copied into your clipboard!',
      status: 'success',
    });
  };

  return (
    <TouchableHighlight underlayColor={colorPrimary200} onPress={handleOnCopy}>
      <Flex flexWrap="wrap" flexDirection={'row'} {...props}>
        {mnemonic.split(' ').map((phrase, i) => (
          <Box
            mr={4}
            mb={2}
            px={2}
            py={1}
            key={`${i}-${mnemonic}`}
            borderRadius={'md'}
            backgroundColor="primary.200:alpha.20"
            borderColor={'primary.500'}
            borderStyle={'solid'}
            borderWidth={'1pt'}
          >
            <Text fontWeight="bold" color="primary.500" selectable>
              {i + 1}. {phrase}
            </Text>
          </Box>
        ))}
      </Flex>
    </TouchableHighlight>
  );
};
