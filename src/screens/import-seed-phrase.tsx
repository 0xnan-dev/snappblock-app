import React, {useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {VStack, Button, TextArea, FormControl} from 'native-base';
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

const ImportSeedPhraseScreen = () => {
  const {control, handleSubmit} = useForm({
    defaultValues: {
      seedPhrase: '',
    },
  });

  const onSubmit = async (data: {seedPhrase: string}) => {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(data.seedPhrase);
    const [firstAccount] = await wallet.getAccounts();
    console.log(firstAccount)
    console.log(firstAccount.pubkey)
  };

  return (
    <VStack width="80%" space={4}>
      <FormControl isRequired>
        <FormControl.Label>Enter a 24-word seed phrase</FormControl.Label>
        <Controller
          control={control}
          name="seedPhrase"
          render={({
            field: {onChange, value},
            fieldState: {invalid, isTouched, isDirty, error},
            formState,
          }) => (
            <TextArea
              placeholder="TextArea"
              onChangeText={(val) => onChange(val)}
              defaultValue={value}
            />
          )}
        />
      </FormControl>

      <Button onPress={handleSubmit(onSubmit)} colorScheme="pink">
        Submit
      </Button>
    </VStack>
  );
};

export default ImportSeedPhraseScreen;
