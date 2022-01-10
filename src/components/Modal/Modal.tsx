import React, { FC } from 'react';
import { Button, Modal as BaseModal } from 'native-base';
import { UserModalContextProps } from './UseModalContext';

export interface ModalProps extends UserModalContextProps {
  hasFooter?: boolean;
  onClickCancel?: () => void;
  onClickOk?: () => void;
  okText?: string;
  cancelText?: string;
  title?: string;
}

export const ModalBody = BaseModal.Body;
export const ModalCloseButton = BaseModal.CloseButton;
export const ModalContent = BaseModal.Content;
export const ModalFooter = BaseModal.Footer;
export const ModalHeader = BaseModal.Header;

export const Modal: FC<ModalProps> = ({
  children,
  close,
  isOpen,
  okText = 'OK',
  cancelText = 'Cancel',
  onClickCancel,
  onClickOk,
  title,
  hasFooter = true,
}) => (
  <BaseModal isOpen={isOpen} onClose={() => close()}>
    <BaseModal.Content maxWidth="400px">
      <BaseModal.CloseButton />
      {title && <BaseModal.Header>{title}</BaseModal.Header>}
      <BaseModal.Body>{children}</BaseModal.Body>
      {hasFooter && (
        <BaseModal.Footer>
          <Button.Group space={2}>
            <Button variant="ghost" onPress={onClickCancel}>
              {cancelText}
            </Button>
            <Button colorScheme="primary" onPress={onClickOk}>
              {okText}
            </Button>
          </Button.Group>
        </BaseModal.Footer>
      )}
    </BaseModal.Content>
  </BaseModal>
);
