import React, {useState, useRef} from 'react';
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
import {useForm, Controller} from 'react-hook-form';
import {DirectSecp256k1HdWallet} from '@cosmjs/proto-signing';

const NewWalletScreen = () => {
  const [showConfirmSeedPhraseModal, setShowConfirmWalletModal] =
    useState(false);
  const initalShowConfirmSeedPhraseModalRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [newWallet, setNewWallet] = useState<DirectSecp256k1HdWallet | null>(
    null,
  );
  const [
    isConfirmSeedPhraseCopyButtonDisabled,
    setIsConfirmSeedPhraseCopyButtonDisabled,
  ] = useState(true);
  const {control, handleSubmit} = useForm({
    defaultValues: {
      password: '',
    },
  });

  const onPressGenerateWalletButton = async () => {
    console.log('onPressGenerateWalletButton');
    const wallet: DirectSecp256k1HdWallet =
      await DirectSecp256k1HdWallet.generate(24);
    setNewWallet(wallet);
  };

  const onSubmit = async (data: {password: string}) => {
    console.log('confirmWallet');
    const serialization = await newWallet.serialize(data.password);
    console.log(serialization);
    const restore = await DirectSecp256k1HdWallet.deserialize(
      serialization,
      data.password,
    );
    console.log(restore);
  };

  return (
    <VStack width="80%" space={4}>
      {newWallet ? (
        <Box>
          <Text>{newWallet.secret.data}</Text>
          <Checkbox
            value="checkSeedPhraseCopy"
            accessibilityLabel="I've written down the seed phrase and stored it in a secure place."
            onChange={(checkSeedPhraseCopy) => {
              checkSeedPhraseCopy
                ? setIsConfirmSeedPhraseCopyButtonDisabled(false)
                : setIsConfirmSeedPhraseCopyButtonDisabled(true);
            }}>
            I've written down the seed phrase and stored it in a secure place.
          </Checkbox>
          <Button
            isDisabled={isConfirmSeedPhraseCopyButtonDisabled}
            onPress={() => setShowConfirmWalletModal(true)}>
            Next
          </Button>
          <Modal
            isOpen={showConfirmSeedPhraseModal}
            onClose={() => setShowConfirmWalletModal(false)}>
            <Modal.Content maxWidth="400px">
              <Modal.CloseButton />
              <Modal.Header>Encrypt Wallet</Modal.Header>
              <Modal.Body>
                <FormControl isRequired>
                  <Controller
                    control={control}
                    name="password"
                    render={({
                      field: {onChange, value},
                      fieldState: {invalid, isTouched, isDirty, error},
                      formState,
                    }) => (
                      <Input
                        mt={4}
                        ref={initalShowConfirmSeedPhraseModalRef}
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
                  <Button onPress={handleSubmit(onSubmit)}>
                    Confirm
                  </Button>
                  <Button
                    onPress={() => {
                      setShowConfirmWalletModal(false);
                    }}>
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

export default NewWalletScreen;
