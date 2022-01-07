import React, { FC, useState } from 'react';
import { UseModalContext } from './UseModalContext';

export const ModalProvider: FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const show = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <UseModalContext.Provider value={{ isOpen, show, close }}>
      {children}
    </UseModalContext.Provider>
  );
};
