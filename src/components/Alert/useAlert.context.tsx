import { createContext } from 'react';

export interface UseAlertProps {
  isOpen: boolean;
  title: string;
  message?: string;
  show: (alert: { title: string; message?: string }) => void;
  close: () => void;
}

export const UseAlertContext = createContext<UseAlertProps>({
  isOpen: false,
  title: '',
  show: (() => null) as never,
  close: (() => null) as never,
});
