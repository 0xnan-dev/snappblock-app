import {ISCNQueryClient, ISCNSigningClient} from '@likecoin/iscn-js';
import {DirectSecp256k1HdWallet} from '@cosmjs/proto-signing';

export async function signISCNTxn(payload: any) {
  try {
    // // local node mnemonic
    // const mnemonic = "person regular host recall weapon brave turn fabric turtle shoot spatial certain require donate swear buzz praise priority desk find rocket client sight special";

    // digital ocean node mnemonic
    const mnemonic =
      'tree sword thought group coil urban long doll group area tobacco voice canvas arch host caught loud scissors comic enable slush lizard twist sport'; //'olympic merry pioneer weasel begin bring cannon already harbor whip frequent supreme powder return ticket hungry more better alcohol maximum maid pluck foster thrive';
    const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
    const [wallet] = await signer.getAccounts();

    console.debug('wallet', wallet);

    const client = new ISCNQueryClient();
    const signingClient = new ISCNSigningClient();
    await signingClient.connectWithSigner(
      'http://139.59.231.31:26657/',
      signer,
    );
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

    const iscnID = await client.queryISCNIdsByTx(response.transactionHash);
    console.debug('iscnID', iscnID);

    return response;
  } catch (error) {
    console.debug('error', error);
  }
}
