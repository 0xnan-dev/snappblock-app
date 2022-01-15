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
    size={5}
    color="muted.400"
  />
);

const ShowIcon: FC = () => (
  <Icon as={<MaterialIcons name="visibility" />} size={5} color="muted.400" />
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
      title="Unlock Wallet"
      okText="Unlock"
      onClickCancel={() => {
        props.close();
      }}
      onClickOk={handleSubmit(onSubmit)}
      {...props}
    >
      <Text fontWeight="bold" mt={4}>
        {walletName}
      </Text>

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
    </Modal>
  );
};