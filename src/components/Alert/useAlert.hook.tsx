import { useContext } from 'react';
import { UseAlertContext } from './useAlert.context';

export const useAlert = () => useContext(UseAlertContext);
