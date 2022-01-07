import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { useAlert } from '../components';
import { SecureStore } from '../lib';
import { IAlertProps } from 'native-base';
import React, {
  FC,
  createContext,
  useContext,
  useReducer,
  Reducer,
  useEffect,
} from 'react';

export const DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY =
  'DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY';

export interface StateContextProps {
  wallet: DirectSecp256k1HdWallet | null;
  isLoading: boolean;
  alert: {
    title: string;
    message?: string;
    status: IAlertProps['status'];
  } | null;
  hasStoredWallet: boolean;
  createWallet: () => Promise<void>;
  storeWallet: (password: string) => Promise<void>;
  restoreWallet: (mnemonic: string) => Promise<void>;
  decryptWallet: (password: string) => Promise<void>;
  fetchGallery: () => Promise<void>;
  upload: () => Promise<void>;
}

const initialState: StateContextProps = {
  wallet: null,
  alert: null,
  isLoading: false,
  hasStoredWallet: false,
  createWallet: null as never,
  storeWallet: null as never,
  restoreWallet: null as never,
  fetchGallery: null as never,
  upload: null as never,
  decryptWallet: null as never,
};

type Action =
  | { type: 'initalizing' }
  | { type: 'reset' }
  | { type: 'initalized'; hasStoredWallet: boolean }
  | {
      type: 'setWallet';
      wallet: DirectSecp256k1HdWallet;
    }
  | { type: 'creatingWallet' }
  | { type: 'createdWallet'; message: string }
  | { type: 'storingWallet' }
  | { type: 'storedWallet'; message: string }
  | { type: 'restoringWallet' }
  | { type: 'restoredWallet'; message: string }
  | { type: 'decryptingWallet' }
  | { type: 'decryptedWallet'; message: string }
  | { type: 'fetchingGallery' }
  | { type: 'setGallery' }
  | {
      type: 'setError';
      error: string;
    };

export const StateContext = createContext<StateContextProps>(initialState);

const reducer: Reducer<StateContextProps, Action> = (state, action) => {
  console.debug('reducer: ', JSON.stringify(action, null, 2));

  const defaultState = {
    ...state,
    error: null,
    alert: null,
    hasStoredWallet: false,
    isLoading: false,
  };

  switch (action.type) {
    case 'reset':
      return defaultState;
    case 'initalized':
      return {
        ...defaultState,
        hasStoredWallet: true,
      };
    case 'setWallet':
      return {
        ...defaultState,
        wallet: action.wallet,
      };
    case 'setError':
      return {
        ...defaultState,
        status: 'failed',
        alert: {
          status: 'error',
          title: action.error,
        },
      };
    case 'storedWallet':
      return {
        ...defaultState,
        hasStoredWallet: true,
        alert: {
          status: 'success',
          title: action.message,
        },
      };
    case 'createdWallet':
    case 'restoredWallet':
    case 'decryptedWallet':
      return {
        ...defaultState,
        alert: {
          status: 'success',
          title: action.message,
        },
      };
    case 'initalizing':
    case 'creatingWallet':
    case 'storingWallet':
    case 'restoringWallet':
    case 'decryptingWallet':
      return {
        ...defaultState,
        isLoading: true,
      };
    default:
      return state;
  }
};

export const StateProvider: FC = ({ children }) => {
  const { show: showAlert } = useAlert();
  const [state, dispatch] = useReducer(reducer, initialState);

  const createWallet = async () => {
    dispatch({ type: 'creatingWallet' });

    try {
      const wallet = await DirectSecp256k1HdWallet.generate(24);

      dispatch({ type: 'setWallet', wallet });
    } catch (ex) {
      console.error(ex);

      dispatch({ type: 'setError', error: 'Failed to create wallet!' });
    }
  };

  const restoreWallet = async (mnemonic: string) => {
    dispatch({ type: 'restoringWallet' });

    try {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);

      dispatch({ type: 'setWallet', wallet });

      dispatch({
        type: 'decryptedWallet',
        message: 'Your wallet has been restored!',
      });
    } catch (ex) {
      console.error(ex);

      dispatch({
        type: 'setError',
        error: 'Failed to restore wallet!',
      });
    }
  };

  const storeWallet = async (password: string) => {
    dispatch({ type: 'storingWallet' });

    if (!state.wallet) {
      dispatch({ type: 'reset' });

      return;
    }

    try {
      const serializedWallet = await state.wallet.serialize(password);

      // store to secure store
      await SecureStore.setItem(
        DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY,
        serializedWallet
      );

      dispatch({
        type: 'storedWallet',
        message: 'Your wallet has been encrypted and stored!',
      });
    } catch (ex) {
      dispatch({
        type: 'setError',
        error: 'Failed to store wallet!',
      });
    }
  };

  const decryptWallet = async (password: string) => {
    dispatch({ type: 'decryptingWallet' });

    try {
      const serializedWallet = await SecureStore.getItem(
        DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY
      );

      if (!serializedWallet) {
        dispatch({ type: 'setError', error: 'No stored wallet!' });

        return;
      }

      await DirectSecp256k1HdWallet.deserialize(serializedWallet, password);

      dispatch({
        type: 'decryptedWallet',
        message: 'Your wallet has been restored!',
      });
    } catch (ex) {
      console.error(ex);

      dispatch({ type: 'setError', error: 'Invalid password!' });
    }
  };

  const upload = async () => {};

  const fetchGallery = async () => {};

  const init = async () => {
    console.debug('init()');

    const storedWallet = await SecureStore.getItem(
      DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY
    );

    if (storedWallet) {
      dispatch({ type: 'initalized', hasStoredWallet: true });
    } else {
      dispatch({ type: 'reset' });
    }
  };

  useEffect(() => {
    dispatch({ type: 'initalizing' });

    init();
  }, []);

  useEffect(() => {
    if (state.alert) {
      showAlert(state.alert);
    }
  }, [showAlert, state.alert]);

  return (
    <StateContext.Provider
      value={{
        ...state,
        createWallet,
        restoreWallet,
        upload,
        fetchGallery,
        storeWallet,
        decryptWallet,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => useContext(StateContext);
