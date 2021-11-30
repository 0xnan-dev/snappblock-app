import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {DirectSecp256k1HdWallet} from '@cosmjs/proto-signing';
import * as SecureStore from 'expo-secure-store';
import {RootState} from 'src/store';

export const DEFAULT_WALLET_SERIALIZATION_SECURE_KEY =
  'DEFAULT_WALLET_SERIALIZATION_SECURE_KEY';

export const DEFAULT_WALLET_FIRST_ACCOUNT_ADDRESS_KEY =
  'DEFAULT_WALLET_FIRST_ACCOUNT_ADDRESS_SECURE_KEY';

export interface WalletState {
  mnemonic: null | string;
  serialization: null | string;
  firstAccountAddress?: string;
  status: 'idle' | 'loading' | 'restoring' | 'failed';
  loading: boolean;
}

const initialState: WalletState = {
  mnemonic: null,
  serialization: null,
  status: 'idle',
};

export const generateNewWalletAsync = createAsyncThunk(
  'wallet/generateNewWallet',
  async (length: 12 | 15 | 18 | 21 | 24) => {
    const wallet = await DirectSecp256k1HdWallet.generate(length);
    return {
      mnemonic: wallet.mnemonic,
    };
  },
);

export const importWalletAsync = createAsyncThunk(
  'wallet/importNewWalletAsync',
  async (mnemonic: string) => {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
    const [firstAccount] = await wallet.getAccounts();
    return {
      mnemonic: wallet.mnemonic,
      firstAccountAddress: firstAccount.address,
    };
  },
);

export const saveNewWalletAsync = createAsyncThunk(
  'wallet/saveNewWalletAsync',
  async (password: string, thunkAPI) => {
    const state = thunkAPI.getState();
    const mnemonic = state.wallet.mnemonic;
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
    const [firstAccount] = await wallet.getAccounts();
    const walletSerialization = await wallet.serialize(password);
    const firstAccountAddress = firstAccount.address;
    await SecureStore.setItemAsync(
      DEFAULT_WALLET_SERIALIZATION_SECURE_KEY,
      walletSerialization,
    );
    await SecureStore.setItemAsync(
      DEFAULT_WALLET_FIRST_ACCOUNT_ADDRESS_KEY,
      firstAccountAddress,
    );

    return {
      serialization: walletSerialization,
      firstAccountAddress: firstAccountAddress,
    };
  },
);

export const restoreWalletSeralization = createAsyncThunk(
  'wallet/restoreWalletSeralization',
  async () => {
    const walletSerialization = await SecureStore.getItemAsync(
      DEFAULT_WALLET_SERIALIZATION_SECURE_KEY,
    );

    const firstAccountAddress = await SecureStore.getItemAsync(
      DEFAULT_WALLET_FIRST_ACCOUNT_ADDRESS_KEY,
    );

    return {
      serialization: walletSerialization,
      firstAccountAddress: firstAccountAddress,
    };
  },
);

const walletsSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateNewWalletAsync.pending, (state, _action) => {
        console.debug('generateNewWalletAsync pending');
        state.status = 'loading';
      })
      .addCase(generateNewWalletAsync.rejected, (state, _action) => {
        console.debug('generateNewWalletAsync rejected');
        state.status = 'failed';
      })
      .addCase(generateNewWalletAsync.fulfilled, (state, action) => {
        console.debug('generateNewWalletAsync fulfilled');
        state.mnemonic = action.payload.mnemonic;
        state.status = 'idle';
      })
      .addCase(importWalletAsync.pending, (state) => {
        console.debug('importWalletAsync pending');
        state.status = 'loading';
      })
      .addCase(importWalletAsync.rejected, (state, _action) => {
        console.debug('importWalletAsync rejected');
        state.status = 'failed';
      })
      .addCase(importWalletAsync.fulfilled, (state, action) => {
        console.debug('importWalletAsync fulfilled');
        state.mnemonic = action.payload.mnemonic;
        state.firstAccountAddress = action.payload.firstAccountAddress;
        state.status = 'idle';
      })
      .addCase(saveNewWalletAsync.pending, (state) => {
        console.debug('saveNewWalletAsync pending');
        state.status = 'loading';
      })
      .addCase(saveNewWalletAsync.rejected, (state, action) => {
        console.debug('saveNewWalletAsync rejected');
        state.mnemonic = null;
        state.status = 'failed';
      })
      .addCase(saveNewWalletAsync.fulfilled, (state, action) => {
        console.debug('saveNewWalletAsync fulfilled');
        state.mnemonic = null;
        state.firstAccountAddress = action.payload.firstAccountAddress;
        state.serialization = action.payload.serialization;
        state.status = 'idle';
      })
      .addCase(restoreWalletSeralization.pending, (state, _action) => {
        console.debug('restoreWalletSeralization pending');
        state.status = 'restoring';
      })
      .addCase(restoreWalletSeralization.rejected, (state, _action) => {
        console.debug('restoreWalletSeralization rejected');
        state.serialization = null;
        state.status = 'failed';
      })
      .addCase(restoreWalletSeralization.fulfilled, (state, action) => {
        console.debug('restoreWalletSeralization fulfilled');
        state.firstAccountAddress = action.payload.firstAccountAddress;
        state.serialization = action.payload.serialization;
        state.status = 'idle';
      });
  },
});

export const selectOptionalWalletMnemonic = (state: RootState) =>
  state.wallet.mnemonic;

export const selectOptionalWalletSerialization = (state: RootState) =>
  state.wallet.serialization;

export const selectIsWalletRestoring = (state: RootState) =>
  state.wallet.status === 'restoring';

export const selectFirstAccountAddress = (state: RootState) =>
  state.wallet.firstAccountAddress;

export default walletsSlice.reducer;
