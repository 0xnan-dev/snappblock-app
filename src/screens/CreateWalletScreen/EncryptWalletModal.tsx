import React, { FC, useRef, useState } from 'react';
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
    color="muted.400"
    size={5}
  />
);

const ShowIcon: FC = () => (
  <Icon as={<MaterialIcons name="visibility" />} color="muted.400" size={5} />
);

export interface EncryptWalletModalProps extends ModalProps {
  isLoading?: boolean;
  onSubmit: (data: SaveMneonicFormType) => void;
}

export const EncryptWalletModal: FC<EncryptWalletModalProps> = ({
  onSubmit,
  isLoading,
  ...props
}) => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const passwordInputRef = useRef<any>();
  const confirmPasswordInputRef = useRef<any>();
  /* eslint-enable @typescript-eslint/no-explicit-any */
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
      cancelButtonProps={{
        disabled: isLoading,
      }}
      closeOnOverlayClick={!isLoading}
      okButtonProps={{
        isLoading,
      }}
      okText="Confirm"
      title="Encrypt Wallet"
      onClickCancel={() => {
        if (props.onClose) props.onClose();
      }}
      onClickOk={handleSubmit(onSubmit)}
      {...props}
    >
      <FormControl isInvalid={Boolean(errors.walletName)} isRequired>
        <Controller
          control={control}
          name="walletName"
          render={({ field: { onChange, value } }) => (
            <Input
              autoFocus
              defaultValue={value}
              mt={4}
              placeholder="Account Name"
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
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
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
              ref={passwordInputRef}
              defaultValue={value}
              InputRightElement={
                <Button
                  mr={5}
                  roundedLeft={0}
                  roundedRight="sm"
                  size={5}
                  variant="unstyled"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <ShowIcon /> : <HideIcon />}
                </Button>
              }
              mt={4}
              placeholder="Password"
              returnKeyType="next"
              type={showPassword ? 'text' : 'password'}
              onChangeText={val => onChange(val)}
              onSubmitEditing={() => {
                confirmPasswordInputRef?.current?.focus();
              }}
            />
          )}
        />
        {errors.password && (
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.password.message}
          </FormControl.ErrorMessage>
        )}
      </FormControl>

      <FormControl isInvalid={Boolean(errors.passwordConfirm)} isRequired>
        <Controller
          control={control}
          name="passwordConfirm"
          render={({ field: { onChange, value } }) => (
            <Input
              ref={confirmPasswordInputRef}
              defaultValue={value}
              InputRightElement={
                <Button
                  mr={5}
                  roundedLeft={0}
                  roundedRight="sm"
                  size={5}
                  variant="unstyled"
                  onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
                >
                  {showPasswordConfirm ? <ShowIcon /> : <HideIcon />}
                </Button>
              }
              mt={4}
              placeholder="Confirm Password"
              returnKeyType="done"
              type={showPasswordConfirm ? 'text' : 'password'}
              onChangeText={val => onChange(val)}
              onSubmitEditing={handleSubmit(onSubmit)}
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
