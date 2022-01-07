import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  VStack,
  Button,
  View,
  TextArea,
  Modal,
  Input,
  FormControl,
} from 'native-base';
import { useAppState } from '../hooks';

export const RestoreWalletScreen = () => {
  const { decryptWallet, storeWallet } = useAppState();
  const [showEncryptWalletModal, setShowEncryptWalletModal] = useState(false);
  const initalShowEncryptWalletModalRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const { control: controlImportSeed, handleSubmit } = useForm({
    defaultValues: {
      seedPhrase: '',
    },
  });
  const {
    control: controlEncryptWallet,
    handleSubmit: handleEncryptWalletSubmit,
  } = useForm({
    defaultValues: {
      password: '',
    },
  });

  const handleImportSeedSubmit = async (data: { seedPhrase: string }) => {
    await decryptWallet(data.seedPhrase);
  };

  const handleStoreWallet = async (data: { password: string }) => {
    await storeWallet(data.password);
  };

  return (
    <View>
      <VStack paddingX={6} space={4}>
        <FormControl isRequired>
          <FormControl.Label>Enter a 24-word seed phrase</FormControl.Label>
          <Controller
            control={controlImportSeed}
            name="seedPhrase"
            render={({ field: { onChange, value } }) => (
              <TextArea
                placeholder=""
                onChangeText={val => onChange(val)}
                defaultValue={value}
                numberOfLines={4}
                autoCapitalize="none"
                secureTextEntry={true}
              />
            )}
          />
        </FormControl>

        <Button
          onPress={handleSubmit(handleImportSeedSubmit)}
          colorScheme="pink"
        >
          Submit
        </Button>
        <Modal
          isOpen={showEncryptWalletModal}
          onClose={() => setShowEncryptWalletModal(false)}
        >
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Encrypt Wallet</Modal.Header>
            <Modal.Body>
              <FormControl isRequired>
                <Controller
                  control={controlEncryptWallet}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      mt={4}
                      ref={initalShowEncryptWalletModalRef}
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
                <Button onPress={handleEncryptWalletSubmit(handleStoreWallet)}>
                  Confirm
                </Button>
                <Button
                  onPress={() => {
                    setShowEncryptWalletModal(false);
                  }}
                >
                  Cancel
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </VStack>
    </View>
  );
};
