import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import BigNumber from 'bignumber.js';
import { BroadcastTxSuccess, StargateClient } from '@cosmjs/stargate';
import { IAlertProps } from 'native-base';
import React, {
  FC,
  createContext,
  useContext,
  useReducer,
  Reducer,
  useEffect,
} from 'react';
import { CameraCapturedPicture } from 'expo-camera';
import { ISCNSignPayload } from '@likecoin/iscn-js';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import {
  hashSha256,
  SecureStore,
  getNewWalletFromSeed,
  createISCNRecord,
  queryRecordsByFingerprint,
} from '../lib';
import { useAlert } from '../components';
import { PhotoItem } from '../interfaces';
import { useIPFS } from './ipfs.hook';

export const DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY =
  'DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY';

type AlertPayloadType = {
  title: string;
  message?: string;
  status: IAlertProps['status'];
} | null;

type StoredWalletType = {
  name: string;
  wallet: DirectSecp256k1HdWallet;
};

const isDev = process.env.NODE_ENV !== 'production';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const COSMOS_RPC = process.env.COSMOS_RPC!;
const COSMOS_DENOM = process.env.COSMOS_DENOM!;
/* eslint-enable @typescript-eslint/no-non-null-assertion */

export interface AppStateContextProps {
  wallet: DirectSecp256k1HdWallet | null;
  balance: BigNumber | null;
  isLoading: boolean;
  alert: AlertPayloadType;
  picture: CameraCapturedPicture | null;
  photos: PhotoItem[];
  hasStoredWallet: boolean;
  storedWalletName: string | null;
  createWallet: () => Promise<DirectSecp256k1HdWallet | null>;
  storeWallet: (
    walletName: string,
    wallet: DirectSecp256k1HdWallet,
    password: string
  ) => Promise<void>;
  restoreWallet: (mnemonic: string) => Promise<DirectSecp256k1HdWallet | null>;
  decryptWallet: (password: string) => Promise<void>;
  fetchPhotos: (
    fromeSequence?: number
  ) => Promise<{ photos: PhotoItem[]; nextSequence: number }>;
  upload: (
    picture: CameraCapturedPicture,
    message: string
  ) => Promise<TxRaw | BroadcastTxSuccess | null>;
  setPicture: (data: CameraCapturedPicture) => void;
  setAlert: (alert: AlertPayloadType) => void;
  setBalance: (balance: BigNumber) => void;
  reset: () => void;
}

const initialState: AppStateContextProps = {
  wallet: null,
  picture: null,
  balance: null,
  alert: null,
  photos: [],
  storedWalletName: null,
  isLoading: false,
  hasStoredWallet: false,
  createWallet: null as never,
  storeWallet: null as never,
  restoreWallet: null as never,
  fetchPhotos: null as never,
  upload: null as never,
  decryptWallet: null as never,
  setPicture: null as never,
  setAlert: null as never,
  setBalance: null as never,
  reset: null as never,
};

// eslint-disable-next-line no-shadow
enum ActionType {
  INITALIZING = 'INITALIZING',
  RESET = 'RESET',
  INITALIZED = 'INITALIZED',
  STORING_WALLET = 'STORING_WALLET',
  STORED_WALLET = 'STORED_WALLET',
  RESTORING_WALLET = 'RESTORING_WALLET',
  RESTORED_WALLET = 'RESTORED_WALLET',
  DECRYPTING_WALLET = 'DECRYPTING_WALLET',
  DECRYPTED_WALLET = 'DECRYPTED_WALLET',
  FETCHING_PHOTOS = 'FETCHING_PHOTOS',
  FETCHED_PHOTOS = 'FETCHED_PHOTOS',
  SET_ERROR = 'SET_ERROR',
  SET_ALERT = 'SET_ALERT',
  SET_PICTURE = 'SET_PICTURE',
  SET_BALANCE = 'SET_BALANCE',
  UPLOADING = 'UPLOADING',
  UPLOADED = 'UPLOADED',
}

type Action =
  | { type: ActionType.INITALIZING }
  | { type: ActionType.RESET }
  | {
      type: ActionType.INITALIZED;
      hasStoredWallet: boolean;
      storedWalletName: string;
    }
  | { type: ActionType.STORING_WALLET }
  | {
      type: ActionType.STORED_WALLET;
      message: string;
      wallet: DirectSecp256k1HdWallet;
      storedWalletName: string;
    }
  | { type: ActionType.RESTORING_WALLET }
  | {
      type: ActionType.RESTORED_WALLET;
      message: string;
    }
  | { type: ActionType.DECRYPTING_WALLET }
  | {
      type: ActionType.DECRYPTED_WALLET;
      message: string;
      wallet: DirectSecp256k1HdWallet;
      storedWalletName: string;
    }
  | { type: ActionType.FETCHING_PHOTOS }
  | { type: ActionType.FETCHED_PHOTOS; photos: PhotoItem[] }
  | {
      type: ActionType.SET_ERROR;
      error: string;
    }
  | {
      type: ActionType.SET_ALERT;
      alert: AlertPayloadType;
    }
  | { type: ActionType.SET_PICTURE; picture: CameraCapturedPicture }
  | { type: ActionType.SET_BALANCE; balance: BigNumber }
  | {
      type: ActionType.UPLOADING;
      message: string;
      picture: CameraCapturedPicture;
    }
  | { type: ActionType.UPLOADED };

export const StateContext = createContext<AppStateContextProps>(initialState);

const reducer: Reducer<AppStateContextProps, Action> = (state, action) => {
  console.debug('reducer: ', JSON.stringify(action, null, 2));

  const defaultState = {
    ...state,
    alert: null,
    balance: null,
    wallet: null,
    picture: null,
    storedWalletName: null,
    hasStoredWallet: false,
    isLoading: false,
  };

  switch (action.type) {
    case ActionType.RESET:
      return defaultState;
    case ActionType.INITALIZED:
      return {
        ...defaultState,
        hasStoredWallet: action.hasStoredWallet,
        storedWalletName: action.storedWalletName,
        isLoading: false,
      };
    case ActionType.SET_ERROR:
      return {
        ...state,
        status: 'failed',
        isLoading: false,
        alert: {
          status: 'error',
          title: action.error,
        },
      };
    case ActionType.SET_ALERT:
      return {
        ...state,
        alert: action.alert,
      };
    case ActionType.STORED_WALLET:
      return {
        ...state,
        isLoading: false,
        hasStoredWallet: true,
        storedWalletName: action.storedWalletName,
        wallet: action.wallet,
        alert: {
          status: 'success',
          title: action.message,
        },
      };
    case ActionType.RESTORED_WALLET:
      return {
        ...state,
        isLoading: false,
        alert: {
          status: 'success',
          title: action.message,
        },
      };
    case ActionType.DECRYPTED_WALLET:
      return {
        ...state,
        isLoading: false,
        hasStoredWallet: true,
        wallet: action.wallet,
        alert: {
          status: 'success',
          title: action.message,
        },
      };
    case ActionType.FETCHED_PHOTOS:
      return {
        ...state,
        isLoading: false,
        photos: action.photos,
      };
    case ActionType.INITALIZING:
    case ActionType.FETCHING_PHOTOS:
    case ActionType.STORING_WALLET:
    case ActionType.RESTORING_WALLET:
    case ActionType.DECRYPTING_WALLET:
      return {
        ...state,
        isLoading: true,
      };
    case ActionType.SET_PICTURE:
      return {
        ...state,
        picture: action.picture,
      };
    case ActionType.SET_BALANCE:
      return {
        ...state,
        balance: action.balance,
      };
    case ActionType.UPLOADING:
      return {
        ...state,
        isLoading: true,
        picture: action.picture,
      };
    case ActionType.UPLOADED:
      return {
        ...state,
        isLoading: false,
      };
    default:
      throw new Error('No matched action');
  }
};

export const StateProvider: FC = ({ children }) => {
  const { show: showAlert } = useAlert();
  const { upload: ipfsUpload, authorize: ipfsAuthorize } = useIPFS();
  const [state, dispatch] = useReducer(reducer, initialState);

  const setAlert = (alert: AlertPayloadType) => {
    dispatch({
      type: ActionType.SET_ALERT,
      alert,
    });
  };

  const createWallet = async () => {
    try {
      const wallet = await DirectSecp256k1HdWallet.generate(24);

      return wallet;
    } catch (ex) {
      console.error(ex);

      dispatch({
        type: ActionType.SET_ERROR,
        error: 'Failed to create wallet!',
      });
    }

    return null;
  };

  const restoreWallet = async (mnemonic: string) => {
    dispatch({ type: ActionType.RESTORING_WALLET });

    try {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);

      dispatch({
        type: ActionType.RESTORED_WALLET,
        message: 'Your wallet has been restored!',
      });

      return wallet;
    } catch (ex) {
      console.error(ex);

      dispatch({
        type: ActionType.SET_ERROR,
        error: 'Failed to restore wallet!',
      });
    }

    return null;
  };

  const storeWallet = async (
    walletName: string,
    wallet: DirectSecp256k1HdWallet,
    password: string
  ) => {
    dispatch({ type: ActionType.STORING_WALLET });

    try {
      const serializedWallet = await wallet.serialize(password);

      // store to secure store
      await SecureStore.setItem(
        DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY,
        JSON.stringify({
          name: walletName,
          wallet: serializedWallet,
        })
      );

      dispatch({
        type: ActionType.STORED_WALLET,
        storedWalletName: walletName,
        wallet,
        message: 'Your wallet has been encrypted and stored!',
      });
    } catch (ex) {
      dispatch({
        type: ActionType.SET_ERROR,
        error: 'Failed to store wallet!',
      });
    }
  };

  const decryptWallet = async (password: string) => {
    dispatch({ type: ActionType.DECRYPTING_WALLET });

    try {
      const serializedWallet = await SecureStore.getItem(
        DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY
      );

      if (!serializedWallet) {
        dispatch({ type: ActionType.SET_ERROR, error: 'No stored wallet!' });

        return;
      }

      const deserializeWallet = JSON.parse(serializedWallet) as {
        wallet: string;
        name: string;
      };

      const wallet = await DirectSecp256k1HdWallet.deserialize(
        deserializeWallet.wallet,
        password
      );

      dispatch({
        type: ActionType.DECRYPTED_WALLET,
        wallet,
        storedWalletName: deserializeWallet.name,
        message: 'Your wallet has been restored!',
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (ex: any) {
      console.error(ex);

      if (/ciphertext cannot be decrypted using that key/.test(ex.message)) {
        dispatch({ type: ActionType.SET_ERROR, error: 'Invalid seed phrase!' });

        return;
      }

      dispatch({ type: ActionType.SET_ERROR, error: 'Invalid password!' });
    }
  };

  const setPicture = (picture: CameraCapturedPicture) => {
    dispatch({ type: ActionType.SET_PICTURE, picture });
  };

  const fetchPhotos = async (
    fromSequence = 0
  ): Promise<{ photos: PhotoItem[]; nextSequence: number }> => {
    dispatch({ type: ActionType.FETCHING_PHOTOS });

    let photos = [] as PhotoItem[];
    const queryResponse = await queryRecordsByFingerprint(
      'https://snappblock.app',
      fromSequence
    );

    if (queryResponse) {
      photos = queryResponse.records
        .map<PhotoItem>(({ data }) => {
          const author = data.stakeholders.find(
            stakeholder =>
              stakeholder.contributionType === 'http://schema.org/author'
          );

          return {
            date: new Date(data.contentMetadata.recordTimestamp),
            photo: data.contentMetadata.url,
            description: data.contentMetadata.description,
            fromAddress: author.entity['@id'],
            authorName: author.entity.name,
          };
        })
        .filter(p => Boolean(p.photo)); // must have photo
    }

    dispatch({ type: ActionType.FETCHED_PHOTOS, photos });

    return {
      nextSequence: 0,
      photos: [],
    };
  };

  // get stored check is there any stored wallet
  const init = async () => {
    console.debug('init()');

    dispatch({ type: ActionType.INITALIZING });

    try {
      const storedWallet = await SecureStore.getItem(
        DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY
      );

      if (storedWallet) {
        const deserializedStoredWallet = JSON.parse(
          storedWallet
        ) as StoredWalletType;

        dispatch({
          type: ActionType.INITALIZED,
          hasStoredWallet: true,
          storedWalletName: deserializedStoredWallet.name,
        });
      }
    } catch (ex) {
      dispatch({ type: ActionType.RESET });
    }
  };

  const fetchAccount = async () => {
    if (!state.wallet) {
      return null;
    }

    const [account] = await state.wallet.getAccounts();
    const client = await StargateClient.connect(COSMOS_RPC);

    const balance = await client.getBalance(account.address, COSMOS_DENOM);

    const coinBalance = new BigNumber(balance.amount);

    dispatch({ type: ActionType.SET_BALANCE, balance: coinBalance });
  };

  const reset = () => {
    // reset state
    dispatch({ type: ActionType.RESET });

    // initialize again
    init();
  };

  const upload = async (picture: CameraCapturedPicture, message: string) => {
    if (!state.wallet) {
      dispatch({
        type: ActionType.SET_ERROR,
        error: 'Something went wrong, please try again',
      });

      return null;
    }

    dispatch({ type: ActionType.UPLOADING, picture, message });

    try {
      const wallet = getNewWalletFromSeed(state.wallet.mnemonic, 'cosmos');
      const [account] = await state.wallet.getAccounts();
      const { privateKey, publicKey } = wallet;
      const datePublished = new Date().toISOString().split('T')[0];
      const accountName = state.storedWalletName || 'Snappblock User';

      if (privateKey) {
        const accessToken = await ipfsAuthorize(publicKey, privateKey);

        if (accessToken) {
          // update to IPFS node and get the CID
          let ipfsPath: string;

          if (isDev) {
            ipfsPath = 'QmaFp322feq2gLiCzWQSrupsPBLpMtgjDkWj8cq78YW7AD';
          } else {
            ipfsPath = await ipfsUpload(picture.uri, accessToken);
          }

          // generate picture sha256 hash
          const hash = hashSha256(picture.uri);

          // create ISCEN record
          const record: ISCNSignPayload = {
            name: `${accountName}'s post`,
            recordNotes: 'Snappblock user post',
            recordTimestamp: new Date().toISOString(),
            contentFingerprints: [
              // app.like.co used contentFingerprints to get IPFS image src url getIPFSUrlFromISCN()
              `ipfs://${ipfsPath}`,
              // a finger prints for query
              'https://snappblock.app',
              // sha256 hash of the picture
              `hash://sha256/${hash}`,
            ],
            stakeholders: [
              {
                entity: {
                  '@id': account.address,
                  name: accountName,
                },
                contributionType: 'http://schema.org/author',
                rewardProportion: 0.9,
              },
              {
                entity: {
                  '@id': 'https://github.com/0xnan-dev',
                  name: '0xNaN',
                },
                contributionType: 'http://schema.org/creator',
                rewardProportion: 0.1,
              },
            ],
            type: 'Photo',
            description: message,
            version: 1,
            url: `https://ipfs.io/ipfs/${ipfsPath}`,
            author: accountName,
            datePublished,
          };

          const txn = await createISCNRecord(state.wallet, record);

          showAlert({
            title: `Uploaded Successfully!`,
            status: 'success',
          });

          dispatch({ type: ActionType.UPLOADED });

          return txn;
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (ex: any) {
      console.error(ex);
    }

    dispatch({
      type: ActionType.SET_ERROR,
      error: 'Something went wrong, please try again',
    });

    return null;
  };

  // initialize when provider component mounted
  useEffect(() => {
    init();
  }, []);

  // show alert when alert state not null
  useEffect(() => {
    if (state.alert) {
      showAlert(state.alert, () => setAlert(null));
    }
  }, [showAlert, state.alert]);

  useEffect(() => {
    if (state.wallet) {
      fetchAccount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.wallet]);

  return (
    <StateContext.Provider
      value={{
        ...state,
        createWallet,
        restoreWallet,
        fetchPhotos,
        storeWallet,
        decryptWallet,
        setPicture,
        setAlert,
        reset,
        upload,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => useContext(StateContext);
