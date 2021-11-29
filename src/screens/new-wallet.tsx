import React, {useState, useRef} from 'react';
import {
  Button,
  Text,
  Box,
  Checkbox,
  Modal,
  Input,
  FormControl,
  View,
} from 'native-base';
import {useForm, Controller} from 'react-hook-form';
import {useAppSelector, useAppDispatch} from '../hooks';
import {
  generateNewWalletAsync,
  saveNewWalletAsync,
  selectOptionalWalletMnemonic,
} from '../features/wallet/walletSlice';
import {Alert} from 'react-native';

const NewWalletScreen = ({navigation}) => {
  const newWalletMnemonic = useAppSelector(selectOptionalWalletMnemonic);
  const dispatch = useAppDispatch();
  const [showConfirmSeedPhraseModal, setShowConfirmWalletModal] =
    useState(false);
  const initalShowConfirmSeedPhraseModalRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
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
    dispatch(generateNewWalletAsync(24));
  };

  const onSubmitEncryptWalletForm = async (data: {password: string}) => {
    dispatch(saveNewWalletAsync(data.password))
      .unwrap()
      .then((_originalPromiseResult) => {
        navigation.navigate('Home', {screen: 'Feed'});
        setShowConfirmWalletModal(false);
      })
      .catch((rejectedValueOrSerializedError) => {
        Alert.alert('Error ', rejectedValueOrSerializedError.message, [
          {text: 'OK chillout'},
        ]);
        setShowConfirmWalletModal(false);
      });
  };

  return (
    <View>
      {newWalletMnemonic ? (
        <Box>
          <Text selectable={true}>{newWalletMnemonic}</Text>
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
                  <Button onPress={handleSubmit(onSubmitEncryptWalletForm)}>
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
    </View>
  );
};

export default NewWalletScreen;
