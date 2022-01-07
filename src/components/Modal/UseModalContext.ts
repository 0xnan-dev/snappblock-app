import { createContext } from 'react';

export interface UserModalContextProps {
  isOpen?: boolean;
  close: () => void;
  show: () => void;
}

export const UseModalContext = createContext<UserModalContextProps>({
  isOpen: false,
  close: null as never,
  show: null as never,
});
