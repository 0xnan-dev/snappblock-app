import React, {useState, useRef} from 'react';
import {Alert} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import * as SecureStore from 'expo-secure-store';
import {
  VStack,
  Button,
  TextArea,
  Modal,
  Input,
  FormControl,
} from 'native-base';
import {useAppDispatch} from '../hooks';
import {importWalletAsync, saveNewWalletAsync} from '../features/wallet/walletSlice';

const ImportSeedPhraseScreen = () => {
  const dispatch = useAppDispatch();
  const [showEncryptWalletModal, setShowEncryptWalletModal] = useState(false);
  const initalShowEncryptWalletModalRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const {control: controlImportSeed, handleSubmit: handleImportSeedSubmit} =
    useForm({
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

  const onSubmitImportSeedPhraseForm = async (data: {seedPhrase: string}) => {
    dispatch(importWalletAsync(data.seedPhrase))
      .unwrap()
      .then((originalPromiseResult) => {
        console.debug(originalPromiseResult);
        setShowEncryptWalletModal(true);
      })
      .catch((rejectedValueOrSerializedError) => {
        Alert.alert('Error ', rejectedValueOrSerializedError.message, [
          {text: 'OK chillout'},
        ]);
      });
  };

  const onSubmitEncrypWalletForm = async (data: {password: string}) => {
    dispatch(saveNewWalletAsync(data.password))
      .unwrap()
      .then((originalPromiseResult) => {
        console.debug(originalPromiseResult);
      })
      .catch((rejectedValueOrSerializedError) => {
        Alert.alert('Error ', rejectedValueOrSerializedError.message, [
          {text: 'OK chillout'},
        ]);
      });
  };

  return (
    <VStack width="80%" space={4}>
      <FormControl isRequired>
        <FormControl.Label>Enter a 24-word seed phrase</FormControl.Label>
        <Controller
          control={controlImportSeed}
          name="seedPhrase"
          render={({
            field: {onChange, value},
            fieldState: {invalid, isTouched, isDirty, error},
            formState,
          }) => (
            <TextArea
              placeholder=""
              onChangeText={(val) => onChange(val)}
              defaultValue={value}
              numberOfLines={4}
              autoCapitalize="none"
              secureTextEntry={true}
            />
          )}
        />
      </FormControl>

      <Button
        onPress={handleImportSeedSubmit(onSubmitImportSeedPhraseForm)}
        colorScheme="pink">
        Submit
      </Button>
      <Modal
        isOpen={showEncryptWalletModal}
        onClose={() => setShowEncryptWalletModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Encrypt Wallet</Modal.Header>
          <Modal.Body>
            <FormControl isRequired>
              <Controller
                control={controlEncryptWallet}
                name="password"
                render={({
                  field: {onChange, value},
                  fieldState: {invalid, isTouched, isDirty, error},
                  formState,
                }) => (
                  <Input
                    mt={4}
                    ref={initalShowEncryptWalletModalRef}
                    defaultValue={value}
                    type={showPassword ? 'text' : 'password'}
                    onChangeText={(val) => onChange(val)}
                    InputRightElement={
                      <Button
                        ml={1}
                        roundedLeft={0}
                        roundedRight="md"
                        onPress={() => setShowPassword(!showPassword)}>
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
              <Button
                onPress={handleEncryptWalletSubmit(onSubmitEncrypWalletForm)}>
                Confirm
              </Button>
              <Button
                onPress={() => {
                  setShowEncryptWalletModal(false);
                }}>
                Cancel
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </VStack>
  );
};

export default ImportSeedPhraseScreen;
