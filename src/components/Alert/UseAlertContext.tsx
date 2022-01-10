import { IAlertProps } from 'native-base';
import { createContext } from 'react';

export interface UseAlertProps {
  isOpen: boolean;
  show: (
    alert: { title: string; message?: string } & IAlertProps,
    onClose?: () => void
  ) => void;
  close: () => void;
}

export const UseAlertContext = createContext<UseAlertProps>({
  isOpen: false,
  show: (() => null) as never,
  close: (() => null) as never,
});
