import walletReducer from './features/wallet/walletSlice';

export default function rootReducer(state, action) {
  return {
    wallet: walletReducer(state, action),
  };
}
