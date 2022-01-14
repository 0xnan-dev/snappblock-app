import React, { FC, useState } from 'react';
import {
  Button,
  Input,
  FormControl,
  Icon,
  WarningOutlineIcon,
} from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import { MaterialIcons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Modal, ModalProps } from '../../components';

export interface SaveMneonicFormType {
  walletName: string;
  password: string;
  passwordConfirm: string;
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

export interface EncryptWalletModalProps extends ModalProps {
  onSubmit: (data: SaveMneonicFormType) => void;
}

export const EncryptWalletModal: FC<EncryptWalletModalProps> = ({
  onSubmit,
  ...props
}) => {
  const formSchema = Yup.object().shape({
    walletName: Yup.string()
      .required('Wallet name is required')
      .min(2, 'Wallet name length should be at least 2 characters'),
    password: Yup.string()
      .required('Password is required')
      .min(4, 'Password length should be at least 4 characters'),
    passwordConfirm: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password')], 'Passwords must and should match'),
  });
  const validationOpt = { resolver: yupResolver(formSchema) };
  const { formState, control, handleSubmit } =
    useForm<SaveMneonicFormType>(validationOpt);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const { errors } = formState;

  return (
    <Modal
      title="Encrypt Wallet"
      okText="Confirm"
      onClickOk={handleSubmit(onSubmit)}
      {...props}
    >
      <FormControl isRequired isInvalid={Boolean(errors.walletName)}>
        <Controller
          control={control}
          name="walletName"
          render={({ field: { onChange, value } }) => (
            <Input
              mt={4}
              defaultValue={value}
              type="string"
              onChangeText={val => onChange(val)}
              placeholder="Account Name"
            />
          )}
        />
        {errors.password && (
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
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
              mt={4}
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
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.password.message}
          </FormControl.ErrorMessage>
        )}
      </FormControl>

      <FormControl isRequired isInvalid={Boolean(errors.passwordConfirm)}>
        <Controller
          control={control}
          name="passwordConfirm"
          render={({ field: { onChange, value } }) => (
            <Input
              mt={4}
              defaultValue={value}
              type={showPasswordConfirm ? 'text' : 'password'}
              onChangeText={val => onChange(val)}
              InputRightElement={
                <Button
                  ml={1}
                  roundedLeft={0}
                  roundedRight="sm"
                  variant="unstyled"
                  onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
                >
                  {showPasswordConfirm ? <ShowIcon /> : <HideIcon />}
                </Button>
              }
              placeholder="Confirm Password"
            />
          )}
        />
        {errors.passwordConfirm && (
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.passwordConfirm.message}
          </FormControl.ErrorMessage>
        )}
      </FormControl>
    </Modal>
  );
};
