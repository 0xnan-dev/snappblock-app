import { useContext } from 'react';
import { UseAlertContext } from './UseAlertContext';

export const useAlert = () => useContext(UseAlertContext);
