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

export const Modal: FC<ModalProps> = ({
  children,
  close,
  isOpen,
  okText,
  cancelText,
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
            <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={onClickCancel}
            >
              {cancelText}
            </Button>
            <Button onPress={onClickOk}>{okText}</Button>
          </Button.Group>
        </BaseModal.Footer>
      )}
    </BaseModal.Content>
  </BaseModal>
);
