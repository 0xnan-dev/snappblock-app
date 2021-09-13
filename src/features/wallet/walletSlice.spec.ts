import walletReducer, {WalletState} from './walletSlice';

describe('wallets reducer', () => {
  const initialState: WalletState = {
    status: 'idle',
  };
  it('should handle initial state', () => {
    expect(walletReducer(undefined, {type: 'unknown'})).toEqual({
      status: 'idle',
    });
  });
});
