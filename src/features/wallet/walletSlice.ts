import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {DirectSecp256k1HdWallet} from '@cosmjs/proto-signing';
import * as SecureStore from 'expo-secure-store';
import {RootState} from 'src/store';

export const DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY =
  'DEFAULT_WALLET_SERIALIZATION_SECURE_STORE_KEY';
export interface WalletState {
  mnemonic?: string;
  serialization?: null | string;
  firstAccountAddress?: string;
  status: 'idle' | 'loading' | 'failed';
  loading: boolean;
}

const initialState: WalletState = {
  status: 'idle',
  loading: false,
};

export const generateNewWalletAsync = createAsyncThunk(
  'wallet/generateNewWallet',
  async (length: 12 | 15 | 18 | 21 | 24) => {
    const wallet = await DirectSecp256k1HdWallet.generate(length);
    console.debug(wallet.mnemonic);
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
    console.log('saveNewWalletAsync!!');
    const state = thunkAPI.getState();
    const mnemonic = state.wallet.wallet.mnemonic;
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

const walletsSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    restoreSerialization: (state) => {
      console.debug('restoreSerialization', state);
      state.serialization = state.serialization;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateNewWalletAsync.pending, (state) => {
        console.debug('generateNewWalletAsync pending');
        state.status = 'loading';
      })
      .addCase(generateNewWalletAsync.rejected, (state, _action) => {
        console.debug('generateNewWalletAsync rejected');
        state.status = 'failed';
      })
      .addCase(generateNewWalletAsync.fulfilled, (state, action) => {
        console.debug('generateNewWalletAsync fulfilled');
        state.status = 'idle';
        state.mnemonic = action.payload;
      })
      .addCase(importWalletAsync.pending, (state) => {
        console.debug('importWalletAsync pending');
        state.status = 'loading';
      })
      .addCase(importWalletAsync.rejected, (state) => {
        console.debug('importWalletAsync rejected');
        state.status = 'failed';
      })
      .addCase(importWalletAsync.fulfilled, (state, action) => {
        console.debug('importWalletAsync fulfilled');
        state.status = 'idle';
        state.mnemonic = action.payload;
      })
      .addCase(saveNewWalletAsync.pending, (state) => {
        console.debug('saveNewWalletAsync pending');
        state.status = 'loading';
      })
      .addCase(saveNewWalletAsync.rejected, (state, _action) => {
        console.debug('saveNewWalletAsync rejected');
        state.status = 'failed';
        state.mnemonic = undefined;
      })
      .addCase(saveNewWalletAsync.fulfilled, (state, action) => {
        console.debug('saveNewWalletAsync fulfilled');
        state.status = 'idle';
        state.mnemonic = undefined;
        state.serialization = action.payload;
      });
  },
});

export const {restoreSerialization} = walletsSlice.actions;

export const selectOptionalWalletMnemonic = (state: RootState) =>
  state.wallet.mnemonic;

export const selectOptionalWalletSerialization = (state: RootState) =>
  state.wallet.serialization;

export default walletsSlice.reducer;
