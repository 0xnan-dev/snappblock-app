import React, { FC, useState } from 'react';
import { Alert } from './Alert';
import { UseAlertContext } from './useAlert.context';

export const AlertProvider: FC = ({ children }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);

  const show = (alert: { title: string; message?: string }) => {
    setTitle(alert.title);
    setIsOpen(true);
    setMessage(alert.message);
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <UseAlertContext.Provider value={{ message, isOpen, title, show, close }}>
      {children}
      <Alert
        isOpen={isOpen}
        message={message}
        title={title}
        show={show}
        close={close}
      />
    </UseAlertContext.Provider>
  );
};
