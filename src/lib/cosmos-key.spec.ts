import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { deriveMasterKey, getNewWalletFromSeed } from './cosmos-keys';

const MNEMONIC =
  'salad draw source tuition pull submit code magnet pottery awake snow agent announce valid nuclear smile music inquiry sense ketchup lobster motion tiger stereo';

describe('cosmos-keys', () => {
  describe('deriveMasterKey', () => {
    it('should create a key pair with a mnemonic', () => {
      const { privateKey, publicKey } = deriveMasterKey(MNEMONIC);

      expect(privateKey).toBeDefined();
      expect(publicKey).toBeDefined();
    });
  });

  describe('getNewWalletFromSeed', () => {
    it('should get a wallet from seed', async () => {
      const wallet = getNewWalletFromSeed(MNEMONIC, 'cosmos');
      const hdWallet = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC);
      const [account] = await hdWallet.getAccounts();

      console.log(wallet);

      expect(wallet.cosmosAddress).toBe(account.address);
    });
  });
});
