import React, { useState, FC, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  VStack,
  Box,
  Text,
  Button,
  View,
  TextArea,
  Input,
  FormControl,
  WarningOutlineIcon,
  Icon,
} from 'native-base';
import { StackScreenProps } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppState } from '../hooks';
import { WelcomeStackParamList } from '../types/navigation';

interface EnterSeedPhraseFormType {
  walletName: string;
  seedPhrase: string;
  password: string;
}

const HideIcon: FC = () => (
  <Icon
    as={<MaterialIcons name="visibility-off" />}
    color="muted.400"
    size={5}
  />
);

const ShowIcon: FC = () => (
  <Icon as={<MaterialIcons name="visibility" />} color="muted.400" size={5} />
);

export const RestoreWalletScreen: FC<
  StackScreenProps<WelcomeStackParamList, 'RestoreWallet'>
> = () => {
  const { restoreWallet, storeWallet, isLoading } = useAppState();
  const passwordInputRef = useRef<any>();
  const seedPhraseTextAreaRef = useRef<any>();
  const [showPassword, setShowPassword] = useState(false);
  const formSchema = Yup.object().shape({
    walletName: Yup.string()
      .required('Wallet name is required')
      .min(2, 'Wallet name length should be at leaset 2 characters'),
    password: Yup.string()
      .required('Password is required')
      .min(4, 'Password length should be at least 4 characters'),
    seedPhrase: Yup.string().required('Seed phrase is required'),
  });
  const validationOpt = { resolver: yupResolver(formSchema) };
  const { formState, control, handleSubmit } =
    useForm<EnterSeedPhraseFormType>(validationOpt);
  const { errors } = formState;

  const handleImportSeedSubmit = async (data: EnterSeedPhraseFormType) => {
    if (Object.keys(errors).length) {
      return;
    }

    const wallet = await restoreWallet(data.seedPhrase);

    if (wallet) {
      await storeWallet(data.walletName, wallet, data.password);
    }
  };

  return (
    <View>
      <Box flex={1}>
        <VStack space={4}>
          <FormControl isInvalid={Boolean(errors.walletName)} isRequired>
            <Controller
              control={control}
              name="walletName"
              render={({ field: { onChange, value } }) => (
                <Input
                  autoFocus
                  defaultValue={value}
                  placeholder="Wallet Name"
                  returnKeyType="next"
                  type="string"
                  onChangeText={val => onChange(val)}
                  onSubmitEditing={() => {
                    passwordInputRef?.current?.focus();
                  }}
                />
              )}
            />
            {errors.password && (
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.password.message}
              </FormControl.ErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={Boolean(errors.password)} isRequired>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  defaultValue={value}
                  InputRightElement={
                    <Button
                      mr={2}
                      roundedLeft={0}
                      roundedRight="sm"
                      size={5}
                      variant="unstyled"
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <ShowIcon /> : <HideIcon />}
                    </Button>
                  }
                  placeholder="Password"
                  returnKeyType="next"
                  type={showPassword ? 'text' : 'password'}
                  onChangeText={val => onChange(val)}
                  onSubmitEditing={() => {
                    seedPhraseTextAreaRef?.current?.focus();
                  }}
                />
              )}
            />
            {errors.password && (
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.password.message}
              </FormControl.ErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={Boolean(errors.seedPhrase)} isRequired>
            <FormControl.Label>Enter a 24-word seed phrase</FormControl.Label>
            <Controller
              control={control}
              name="seedPhrase"
              render={({ field: { onChange, value } }) => (
                <TextArea
                  autoCapitalize="none"
                  defaultValue={value}
                  mb={2}
                  numberOfLines={4}
                  placeholder=""
                  returnKeyType="done"
                  secureTextEntry={true}
                  onChangeText={val => onChange(val)}
                  onSubmitEditing={handleSubmit(handleImportSeedSubmit)}
                />
              )}
            />
            <Text color="gray.500" fontSize="sm">
              Separated by space character
            </Text>
            {errors.seedPhrase && (
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {errors.seedPhrase.message}
              </FormControl.ErrorMessage>
            )}
          </FormControl>
        </VStack>
      </Box>

      <Box>
        <Button
          colorScheme="primary"
          isLoading={isLoading}
          onPress={handleSubmit(handleImportSeedSubmit)}
        >
          Submit
        </Button>
      </Box>
    </View>
  );
};
