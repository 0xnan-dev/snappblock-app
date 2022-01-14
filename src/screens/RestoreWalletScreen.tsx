import React, { useState, FC } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  VStack,
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
    size={5}
    color="muted.400"
  />
);

const ShowIcon: FC = () => (
  <Icon as={<MaterialIcons name="visibility" />} size={5} color="muted.400" />
);

export const RestoreWalletScreen: FC<
  StackScreenProps<WelcomeStackParamList, 'RestoreWallet'>
> = () => {
  const { restoreWallet, storeWallet, isLoading } = useAppState();
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
      <VStack space={4}>
        <FormControl isRequired isInvalid={Boolean(errors.walletName)}>
          <Controller
            control={control}
            name="walletName"
            render={({ field: { onChange, value } }) => (
              <Input
                defaultValue={value}
                type="string"
                onChangeText={val => onChange(val)}
                placeholder="Wallet Name"
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

        <FormControl isRequired isInvalid={Boolean(errors.password)}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                defaultValue={value}
                type={showPassword ? 'text' : 'password'}
                onChangeText={val => onChange(val)}
                InputRightElement={
                  <Button
                    ml={1}
                    roundedLeft={0}
                    roundedRight="sm"
                    variant="unstyled"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <ShowIcon /> : <HideIcon />}
                  </Button>
                }
                placeholder="Password"
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

        <FormControl isRequired isInvalid={Boolean(errors.seedPhrase)}>
          <FormControl.Label>Enter a 24-word seed phrase</FormControl.Label>
          <Controller
            control={control}
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
          {errors.seedPhrase && (
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {errors.seedPhrase.message}
            </FormControl.ErrorMessage>
          )}
        </FormControl>

        <Button
          isLoading={isLoading}
          onPress={handleSubmit(handleImportSeedSubmit)}
          colorScheme="primary"
        >
          Submit
        </Button>
      </VStack>
    </View>
  );
};
