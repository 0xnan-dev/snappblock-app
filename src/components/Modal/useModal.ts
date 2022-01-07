import { useContext } from 'react';
import { UseModalContext } from './UseModalContext';

export const useModal = () => useContext(UseModalContext);
