import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import React, { FC, useState, useRef } from 'react';
import {
  Box,
  Button,
  View,
  Checkbox,
  Modal,
  Input,
  FormControl,
} from 'native-base';
import { MnemonicTags } from './MneomicTags';
import { useForm, Controller } from 'react-hook-form';

interface ShowMnemoicViewProps {
  wallet: DirectSecp256k1HdWallet;
  onSubmit: (data: SaveMneonicFormType) => void;
}

export interface SaveMneonicFormType {
  password: string;
}

export const ShowMnemoicView: FC<ShowMnemoicViewProps> = ({
  wallet,
  onSubmit,
}) => {
  const { control, handleSubmit } = useForm<SaveMneonicFormType>({
    defaultValues: {
      password: '',
    },
  });
  const [showConfirmSeedPhraseModal, setShowConfirmWalletModal] =
    useState(false);
  const initalShowConfirmSeedPhraseModalRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [
    isConfirmSeedPhraseCopyButtonDisabled,
    setIsConfirmSeedPhraseCopyButtonDisabled,
  ] = useState(true);

  return (
    <View>
      <MnemonicTags mb={4} mnemonic={wallet.mnemonic} />

      <Box mt="auto">
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
          onPress={() => setShowConfirmWalletModal(true)}
        >
          Next
        </Button>
      </Box>

      <Modal
        isOpen={showConfirmSeedPhraseModal}
        onClose={() => setShowConfirmWalletModal(false)}
      >
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Encrypt Wallet</Modal.Header>
          <Modal.Body>
            <FormControl isRequired>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    mt={4}
                    ref={initalShowConfirmSeedPhraseModalRef}
                    defaultValue={value}
                    type={showPassword ? 'text' : 'password'}
                    onChangeText={val => onChange(val)}
                    InputRightElement={
                      <Button
                        ml={1}
                        roundedLeft={0}
                        roundedRight="md"
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </Button>
                    }
                    placeholder="Password"
                  />
                )}
              />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group variant="ghost" space={2}>
              <Button onPress={handleSubmit(onSubmit)}>Confirm</Button>
              <Button
                onPress={() => {
                  setShowConfirmWalletModal(false);
                }}
              >
                Cancel
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  );
};
