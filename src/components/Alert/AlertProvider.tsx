import { IAlertProps } from 'native-base';
import React, { FC, useState } from 'react';
import { Alert } from './Alert';
import { UseAlertContext } from './UseAlertContext';

export const AlertProvider: FC = ({ children }) => {
  const [message, setMessage] = useState<string>();
  const [title, setTitle] = useState<string>('Alert');
  const [status, setStatus] = useState<IAlertProps['status']>('info');
  const [isOpen, setIsOpen] = useState(false);

  const show = (alert: {
    title: string;
    message?: string;
    status?: string;
  }) => {
    setIsOpen(true);
    setTitle(alert.title);
    setStatus(alert.status || 'info');
    setMessage(alert.message);
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <UseAlertContext.Provider value={{ isOpen, show, close }}>
      <Alert
        isOpen={isOpen}
        message={message}
        title={title}
        show={show}
        status={status}
        close={close}
      />
      {children}
    </UseAlertContext.Provider>
  );
};
