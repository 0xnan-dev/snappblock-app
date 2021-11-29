import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {DirectSecp256k1HdWallet} from '@cosmjs/proto-signing';
import * as SecureStore from 'expo-secure-store';
import {RootState} from 'src/store';

export const DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY =
  'DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY';
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
    return wallet.mnemonic;
  },
);

export const importWalletAsync = createAsyncThunk(
  'wallet/importNewWalletAsync',
  async (mnemonic: string) => {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
    return wallet.mnemonic;
  },
);

export const saveNewWalletAsync = createAsyncThunk(
  'wallet/saveNewWalletAsync',
  async (password: string, thunkAPI) => {
    const state = thunkAPI.getState();
    const mnemonic = state.wallet.mnemonic;
    const directSecp256k1HdWallet = await DirectSecp256k1HdWallet.fromMnemonic(
      mnemonic,
    );
    const directSecp256k1HdWalletSerialization =
      await directSecp256k1HdWallet.serialize(password);
    await SecureStore.setItemAsync(
      DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY,
      directSecp256k1HdWalletSerialization,
    );

    return directSecp256k1HdWalletSerialization;
  },
);

export const restoreWalletSeralization = createAsyncThunk(
  'wallet/restoreWalletSeralization',
  async () => {
    const serialization = await SecureStore.getItemAsync(
      DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY,
    );
    return serialization;
  },
);

const walletsSlice = createSlice({
  name: 'somewallet',
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
        state.mnemonic = action.payload;
        state.status = 'idle';
      })
      .addCase(importWalletAsync.pending, (state) => {
        console.debug('importWalletAsync pending');
        state.status = 'loading';
      })
      .addCase(importWalletAsync.rejected, (state, action) => {
        console.debug('importWalletAsync rejected');
        state.status = 'failed';
      })
      .addCase(importWalletAsync.fulfilled, (state, action) => {
        console.debug('importWalletAsync fulfilled');
        state.mnemonic = action.payload;
        state.status = 'idle';
      })
      .addCase(saveNewWalletAsync.pending, (state) => {
        console.debug('saveNewWalletAsync pending');
        state.status = 'loading';
      })
      .addCase(saveNewWalletAsync.rejected, (state, action) => {
        console.debug('saveNewWalletAsync rejected');
        console.debug(action);
        state.mnemonic = null;
        state.status = 'failed';
      })
      .addCase(saveNewWalletAsync.fulfilled, (state, action) => {
        console.debug('saveNewWalletAsync fulfilled');
        state.mnemonic = null;
        state.serialization = action.payload;
        state.status = 'idle';
      })
      .addCase(restoreWalletSeralization.pending, (state, action) => {
        console.debug('restoreWalletSeralization pending');
        state.status = 'restoring';
      })
      .addCase(restoreWalletSeralization.rejected, (state, action) => {
        console.debug('restoreWalletSeralization rejected');
        state.serialization = null;
        state.status = 'failed';
      })
      .addCase(restoreWalletSeralization.fulfilled, (state, action) => {
        console.debug('restoreWalletSeralization fulfilled');
        state.serialization = action.payload;
        state.status = 'idle';
      })
  },
});

export const selectOptionalWalletMnemonic = (state: RootState) =>
  state.wallet.mnemonic;

export const selectOptionalWalletSerialization = (state: RootState) =>
  state.wallet.serialization;

export const selectIsWalletRestoring = (state: RootState) => state.wallet.status === 'restoring';

export default walletsSlice.reducer;
