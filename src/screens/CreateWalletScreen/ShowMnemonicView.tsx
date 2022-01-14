import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import React, { FC, useState } from 'react';
import { Box, Button, View, Checkbox } from 'native-base';
import { useModal } from '../../components';
import { MnemonicTags } from './MnemonicTags';
import { EncryptWalletModal, SaveMneonicFormType } from './EncryptWalletModal';

interface ShowMnemonicViewProps {
  wallet: DirectSecp256k1HdWallet;
  isLoading?: boolean;
  onSubmit: (data: SaveMneonicFormType) => void;
}

export const ShowMnemonicView: FC<ShowMnemonicViewProps> = ({
  wallet,
  isLoading,
  onSubmit,
}) => {
  const encryptWalletModalProps = useModal();
  const [
    isConfirmSeedPhraseCopyButtonDisabled,
    setIsConfirmSeedPhraseCopyButtonDisabled,
  ] = useState(true);

  return (
    <View justifyContent="space-between">
      <MnemonicTags mb={4} mnemonic={wallet.mnemonic} />

      <Box>
        <Box mb={4}>
          <Checkbox
            value="checkSeedPhraseCopy"
            accessibilityLabel="I've written down the seed phrase and stored it in a secure place."
            onChange={checkSeedPhraseCopy =>
              setIsConfirmSeedPhraseCopyButtonDisabled(!checkSeedPhraseCopy)
            }
          >
            I've written down the seed phrase and stored it in a secure place.
          </Checkbox>
        </Box>

        <Button
          isDisabled={isConfirmSeedPhraseCopyButtonDisabled}
          onPress={() => encryptWalletModalProps.show()}
        >
          Next
        </Button>
      </Box>

      <EncryptWalletModal
        isLoading={isLoading}
        {...encryptWalletModalProps}
        onSubmit={onSubmit}
      />
    </View>
  );
};
