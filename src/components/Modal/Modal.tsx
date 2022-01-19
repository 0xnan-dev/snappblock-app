import React, { ComponentProps, FC } from 'react';
import { Button, IModalProps, Modal as BaseModal } from 'native-base';

export interface ModalProps extends IModalProps {
  showFooter?: boolean;
  isLoading?: boolean;
  onClickCancel?: () => void;
  onClickOk?: () => void;
  disabled?: boolean;
  okText?: string;
  cancelText?: string;
  okButtonProps?: ComponentProps<typeof Button>;
  cancelButtonProps?: ComponentProps<typeof Button>;
  title?: string;
}

export const ModalBody = BaseModal.Body;
export const ModalCloseButton = BaseModal.CloseButton;
export const ModalContent = BaseModal.Content;
export const ModalFooter = BaseModal.Footer;
export const ModalHeader = BaseModal.Header;

export const Modal: FC<ModalProps> = ({
  children,
  isOpen,
  isLoading,
  okText = 'OK',
  cancelText = 'Cancel',
  onClickCancel,
  onClickOk,
  title,
  disabled,
  showFooter = true,
  okButtonProps,
  cancelButtonProps,
  ...props
}) => (
  <BaseModal isOpen={isOpen} {...props}>
    <BaseModal.Content maxWidth="420px">
      <BaseModal.CloseButton disabled={isLoading || disabled} />
      {title && <BaseModal.Header>{title}</BaseModal.Header>}
      <BaseModal.Body>{children}</BaseModal.Body>
      {showFooter && (
        <BaseModal.Footer>
          <Button.Group space={2}>
            <Button
              variant="ghost"
              onPress={onClickCancel}
              {...{ disabled: isLoading || disabled, ...cancelButtonProps }}
            >
              {cancelText}
            </Button>
            <Button
              colorScheme="primary"
              isLoading={isLoading}
              onPress={onClickOk}
              {...{ disabled: isLoading || disabled, ...okButtonProps }}
            >
              {okText}
            </Button>
          </Button.Group>
        </BaseModal.Footer>
      )}
    </BaseModal.Content>
  </BaseModal>
);
