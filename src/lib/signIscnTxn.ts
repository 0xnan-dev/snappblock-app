import {
  ISCNQueryClient,
  ISCNSigningClient,
  ISCNSignPayload,
} from '@likecoin/iscn-js';
import {DirectSecp256k1HdWallet} from '@cosmjs/proto-signing';
import Config from 'react-native-config';

export async function signISCNTxn(payload: ISCNSignPayload) {
  try {
    // digital ocean node testnet mnemonic
    const signer = await DirectSecp256k1HdWallet.fromMnemonic(Config.MNEMONIC);
    const [wallet] = await signer.getAccounts();

    console.debug('wallet', wallet);

    const signingClient = new ISCNSigningClient();
    await signingClient.connectWithSigner(Config.RPC, signer);
    console.debug('signingClient', signingClient);

    const response: any = await signingClient.createISCNRecord(
      wallet.address,
      payload,
      {
        memo: 'debug',
        broadcast: true,
      },
    );

    console.debug('response', response);

    const client = new ISCNQueryClient();
    await client.connect(Config.RPC);
    const iscnID = await client.queryISCNIdsByTx(response.transactionHash);
    console.debug('iscnID', iscnID);

    return response;
  } catch (error) {
    console.debug('error', error);
  }
}
