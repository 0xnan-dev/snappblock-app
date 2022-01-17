import { useToast, useDisclose } from 'native-base';
import ExpoConstants from 'expo-constants';
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
import CryptoJS from 'crypto-js';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import BigNumber from 'bignumber.js';
import { BroadcastTxSuccess, StargateClient } from '@cosmjs/stargate';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import {
  hashSha256,
  SecureStore,
  getNewWalletFromSeed,
  createISCNRecord,
  queryRecordsByFingerprint,
} from '../lib';
import { ImagePreviewModal } from '../components';
import { PhotoItem } from '../interfaces';
import { useIPFS } from './ipfs.hook';

export const DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY =
  'DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY';

type StoredWalletType = {
  name: string;
  wallet: DirectSecp256k1HdWallet;
};

const isDev = process.env.NODE_ENV !== 'production';
const cosmosRpc = ExpoConstants.manifest?.extra?.cosmosRpc;
const cosmosDenom = ExpoConstants.manifest?.extra?.cosmosDenom;
const ipfsNodeUrl = ExpoConstants.manifest?.extra?.ipfsNodeUrl;

const toIpfsUrl = (url: string) => {
  if (/ipfs\.io/.test(url)) {
    return url.replace(/^https:\/\/ipfs\.io/, ipfsNodeUrl);
  }

  return url;
};

export interface AppStateContextProps {
  wallet: DirectSecp256k1HdWallet | null;
  balance: BigNumber | null;
  isLoading: boolean;
  selectedItem: PhotoItem | null;
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
  ) => Promise<BroadcastTxSuccess | TxRaw | null>;
  setPicture: (data: CameraCapturedPicture) => void;
  setBalance: (balance: BigNumber) => void;
  reset: () => void;
  setSelectedItem: (selectedItem: PhotoItem) => void;
}

const initialState: AppStateContextProps = {
  wallet: null,
  picture: null, // picture to upload
  balance: null,
  photos: [],
  storedWalletName: null,
  selectedItem: null,
  isLoading: false,
  hasStoredWallet: false,
  createWallet: null as never,
  storeWallet: null as never,
  restoreWallet: null as never,
  fetchPhotos: null as never,
  upload: null as never,
  decryptWallet: null as never,
  setPicture: null as never,
  setBalance: null as never,
  reset: null as never,
  setSelectedItem: null as never,
};

// eslint-disable-next-line no-shadow
enum ActionType {
  INITIALIZING = 'INITIALIZING',
  RESET = 'RESET',
  INITIALIZED = 'INITIALIZED',
  STORING_WALLET = 'STORING_WALLET',
  STORED_WALLET = 'STORED_WALLET',
  RESTORING_WALLET = 'RESTORING_WALLET',
  RESTORED_WALLET = 'RESTORED_WALLET',
  DECRYPTING_WALLET = 'DECRYPTING_WALLET',
  DECRYPTED_WALLET = 'DECRYPTED_WALLET',
  FETCHING_PHOTOS = 'FETCHING_PHOTOS',
  FETCHED_PHOTOS = 'FETCHED_PHOTOS',
  SET_ALERT = 'SET_ALERT',
  SET_PICTURE = 'SET_PICTURE',
  SET_BALANCE = 'SET_BALANCE',
  SET_SELECTED_ITEM = 'SET_SELECTED_ITEM',
  UPLOADING = 'UPLOADING',
  UPLOADED = 'UPLOADED',
  SET_IS_LOADING = 'SET_IS_LOADING',
}

type Action =
  | { type: ActionType.INITIALIZING }
  | { type: ActionType.RESET }
  | {
      type: ActionType.INITIALIZED;
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
  | { type: ActionType.SET_PICTURE; picture: CameraCapturedPicture }
  | { type: ActionType.SET_BALANCE; balance: BigNumber }
  | {
      type: ActionType.UPLOADING;
      message: string;
      picture: CameraCapturedPicture;
    }
  | { type: ActionType.UPLOADED }
  | { type: ActionType.SET_SELECTED_ITEM; selectedItem: PhotoItem | null }
  | { type: ActionType.SET_IS_LOADING; isLoading: boolean };

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
    selectedItem: null,
    hasStoredWallet: false,
    isLoading: false,
  };

  switch (action.type) {
    case ActionType.RESET:
      return defaultState;
    case ActionType.INITIALIZED:
      return {
        ...defaultState,
        hasStoredWallet: action.hasStoredWallet,
        storedWalletName: action.storedWalletName,
        isLoading: false,
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
    case ActionType.INITIALIZING:
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
        picture: null,
        isLoading: false,
      };
    case ActionType.SET_SELECTED_ITEM:
      return {
        ...state,
        selectedItem: action.selectedItem,
      };
    case ActionType.SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    default:
      throw new Error('No matched action');
  }
};

export const StateProvider: FC = ({ children }) => {
  const toast = useToast();
  const { upload: ipfsUpload, authorize: ipfsAuthorize } = useIPFS();
  const [state, dispatch] = useReducer(reducer, initialState);
  const imagePreviewModalProps = useDisclose();
  const createWallet = async () => {
    try {
      const wallet = await DirectSecp256k1HdWallet.generate(24);

      return wallet;
    } catch (ex) {
      console.error(ex);

      toast.show({
        placement: 'top',
        title: 'Failed to create wallet!',
        status: 'error',
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

      toast.show({
        placement: 'top',
        title: 'Failed to restore wallet!',
        status: 'error',
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
      const encryptedMnemonic = CryptoJS.AES.encrypt(
        wallet.mnemonic,
        password
      ).toString();

      // store to secure store
      await SecureStore.setItem(
        DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY,
        JSON.stringify({
          name: walletName,
          mnemonic: encryptedMnemonic,
        })
      );

      dispatch({
        type: ActionType.STORED_WALLET,
        storedWalletName: walletName,
        wallet,
        message: 'Your wallet has been encrypted and stored!',
      });
    } catch (ex) {
      console.error(ex);

      toast.show({
        placement: 'top',
        status: 'error',
        title: 'Failed to store wallet!',
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
        toast.show({
          placement: 'top',
          status: 'error',
          title: 'No stored wallet!',
        });

        return;
      }

      const deserializeWallet = JSON.parse(serializedWallet) as {
        mnemonic: string;
        name: string;
      };
      const decrypedMnemonicBytes = CryptoJS.AES.decrypt(
        deserializeWallet.mnemonic,
        password
      );
      const decryptedMnemonic = decrypedMnemonicBytes.toString(
        CryptoJS.enc.Utf8
      );
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        decryptedMnemonic
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
        toast.show({
          placement: 'top',
          status: 'error',
          title: 'Invalid seed phrase!',
        });

        return;
      }

      toast.show({
        placement: 'top',
        status: 'error',
        title: 'Invalid password!',
      });

      // reset state
      dispatch({ type: ActionType.RESET });
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
            iscnId: data['@id'] as string,
            date: new Date(data.contentMetadata.recordTimestamp),
            photo: toIpfsUrl(data.contentMetadata.url),
            description: data.contentMetadata.description,
            fromAddress: author.entity['@id'],
            authorName: author.entity.name,
          };
        })
        .filter(p => Boolean(p.photo))
        .sort((a, b) => b.date.getTime() - a.date.getTime()); // must have photo

      dispatch({ type: ActionType.FETCHED_PHOTOS, photos });

      return {
        nextSequence: queryResponse.nextSequence.toNumber(),
        photos,
      };
    }

    // clear state
    dispatch({ type: ActionType.FETCHED_PHOTOS, photos: [] });

    return {
      nextSequence: 0,
      photos: [],
    };
  };

  // get stored check is there any stored wallet
  const init = async () => {
    console.debug('init()');

    dispatch({ type: ActionType.INITIALIZING });

    try {
      const storedWallet = await SecureStore.getItem(
        DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY
      );

      if (storedWallet) {
        const deserializedStoredWallet = JSON.parse(
          storedWallet
        ) as StoredWalletType;

        dispatch({
          type: ActionType.INITIALIZED,
          hasStoredWallet: true,
          storedWalletName: deserializedStoredWallet.name,
        });

        return;
      }
    } catch (ex) {
      console.error(ex);
    }

    dispatch({ type: ActionType.RESET });
  };

  const fetchAccount = async () => {
    if (!state.wallet) {
      return null;
    }

    try {
      const [account] = await state.wallet.getAccounts();
      const client = await StargateClient.connect(cosmosRpc);
      const balance = await client.getBalance(account.address, cosmosDenom);
      const coinBalance = new BigNumber(balance.amount);

      dispatch({ type: ActionType.SET_BALANCE, balance: coinBalance });

      return;
    } catch (ex) {
      console.error(ex);
    }

    toast.show({
      placement: 'top',
      status: 'error',
      title: 'Cannot get account balance, please try again later',
    });
  };

  const reset = () => {
    // reset state
    dispatch({ type: ActionType.RESET });

    // initialize again
    init();
  };

  const upload = async (picture: CameraCapturedPicture, message: string) => {
    if (!state.wallet) {
      toast.show({
        placement: 'top',
        status: 'error',
        title: 'Something went wrong, please try again',
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
                contributionType: 'http://schema.org/publisher',
                rewardProportion: 0.1,
              },
            ],
            type: 'Photo',
            description: message,
            version: 1,
            url: `https://ipfs.io/ipfs/${ipfsPath}`,
            author: accountName,
            publisher: 'Snappblock',
            datePublished,
            usageInfo: 'https://creativecommons.org/licenses/by/4.0',
          };

          const txn = await createISCNRecord(state.wallet, record);

          // fetch new account balance
          await fetchAccount();

          toast.show({
            placement: 'top',
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

    // reset state
    dispatch({ type: ActionType.SET_IS_LOADING, isLoading: false });

    toast.show({
      placement: 'top',
      status: 'error',
      title: 'Something went wrong, please try again',
    });

    return null;
  };

  const setSelectedItem = (photoItem: PhotoItem | null) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: photoItem });
  };

  // initialize when provider component mounted
  useEffect(() => {
    init();
  }, []);

  // open model when selected an item
  useEffect(() => {
    if (state.selectedItem !== null) {
      imagePreviewModalProps.onOpen();
    } else {
      imagePreviewModalProps.onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedItem]);

  useEffect(() => {
    let interval = -1;

    if (state.wallet) {
      interval = setInterval(() => {
        fetchAccount();
      }, 30 * 1000) as unknown as number; // refresh every 30 secs

      fetchAccount();
    }

    return () => {
      if (interval !== -1) {
        clearInterval(interval);
      }
    };
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
        reset,
        upload,
        setSelectedItem,
      }}
    >
      {children}
      <ImagePreviewModal
        description={state.selectedItem?.description}
        fromAddress={state.selectedItem?.fromAddress}
        publishedDate={state.selectedItem?.date}
        source={state.selectedItem?.photo}
        {...imagePreviewModalProps}
        onClose={() => {
          setSelectedItem(null);
        }}
      />
    </StateContext.Provider>
  );
};

export const useAppState = () => useContext(StateContext);
