import React, { useState, useRef } from 'react';
import {
  VStack,
  Button,
  Text,
  Box,
  Checkbox,
  Modal,
  Input,
  FormControl,
} from 'native-base';
import { useForm, Controller } from 'react-hook-form';

import { useStateValue } from '../hooks';

export const CreateWalletScreen = () => {
  const { wallet, storeWallet, createWallet } = useStateValue();
  const [showConfirmSeedPhraseModal, setShowConfirmWalletModal] =
    useState(false);
  const initalShowConfirmSeedPhraseModalRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [
    isConfirmSeedPhraseCopyButtonDisabled,
    setIsConfirmSeedPhraseCopyButtonDisabled,
  ] = useState(true);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      password: '',
    },
  });

  const onPressGenerateWalletButton = async () => {
    await createWallet();
  };

  const onSubmit = async (data: { password: string }) => {
    await storeWallet(data.password);
  };

  return (
    <VStack space={4} paddingX={6}>
      {wallet && wallet.mnemonic ? (
        <Box>
          <Text selectable={true}>{wallet.mnemonic}</Text>
          <Checkbox
            value="checkSeedPhraseCopy"
            accessibilityLabel="I've written down the seed phrase and stored it in a secure place."
            onChange={checkSeedPhraseCopy =>
              setIsConfirmSeedPhraseCopyButtonDisabled(!checkSeedPhraseCopy)
            }
          >
            I've written down the seed phrase and stored it in a secure place.
          </Checkbox>
          <Button
            isDisabled={isConfirmSeedPhraseCopyButtonDisabled}
            onPress={() => setShowConfirmWalletModal(true)}
          >
            Next
          </Button>
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
        </Box>
      ) : (
        <Box>
          <Text>
            Make sure no one is watching the screen, while the seed phrase is
            visible.
          </Text>
          <Button onPress={onPressGenerateWalletButton} colorScheme="green">
            Generate Wallet
          </Button>
        </Box>
      )}
    </VStack>
  );
};
