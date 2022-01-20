import React, { FC, useState } from 'react';
import {
  Text,
  Button,
  Icon,
  FormControl,
  Input,
  WarningOutlineIcon,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Modal, ModalProps } from '../Modal';

export interface UnlockFormType {
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

export interface UnlockModalProps extends ModalProps {
  walletName: string;
  onSubmit: SubmitHandler<UnlockFormType>;
}
export const UnlockModal: FC<UnlockModalProps> = ({
  walletName,
  onSubmit,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const formSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(4, 'Password length should be at least 4 characters'),
  });
  const validationOpt = { resolver: yupResolver(formSchema) };
  const { formState, control, handleSubmit } =
    useForm<UnlockFormType>(validationOpt);
  const { errors } = formState;

  return (
    <Modal
      okText="Unlock"
      title="Unlock Wallet"
      onClickCancel={() => {
        props.onClose();
      }}
      onClickOk={handleSubmit(onSubmit)}
      {...props}
    >
      <Text fontWeight="bold" mt={4}>
        {walletName}
      </Text>

      <FormControl isInvalid={Boolean(errors.password)} isRequired>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              autoFocus
              defaultValue={value}
              InputRightElement={
                <Button
                  mr={2}
                  roundedLeft={0}
                  roundedRight="sm"
                  size={5}
                  variant="unstyled"
                  onPress={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <ShowIcon /> : <HideIcon />}
                </Button>
              }
              mt={4}
              placeholder="Password"
              returnKeyType="done"
              type={showPassword ? 'text' : 'password'}
              onChangeText={val => onChange(val)}
              onSubmitEditing={handleSubmit(onSubmit)}
            />
          )}
        />
        {errors.password && (
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.password.message}
          </FormControl.ErrorMessage>
        )}
      </FormControl>
    </Modal>
  );
};
