import { OfflineSigner } from '@cosmjs/proto-signing';
import {
  ISCNSigningClient,
  ISCNQueryClient,
  ISCNSignPayload,
} from '@likecoin/iscn-js';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
const COSMOS_RPC = process.env.COSMOS_RPC!;
/* eslint-enable @typescript-eslint/no-non-null-assertion */

export const signingClient = new ISCNSigningClient();
export const queryClient = new ISCNQueryClient();

export async function queryISCNIdsByTx(txHash: string): Promise<string[]> {
  await queryClient.connect(COSMOS_RPC);
  const res = await queryClient.queryISCNIdsByTx(txHash);

  return res;
}

export async function queryRecordsById(id: string) {
  await queryClient.connect(COSMOS_RPC);
  const res = await queryClient.queryRecordsById(id);

  return res;
}

export async function queryRecordsByFingerprint(
  fingerprint: string,
  fromSequence: number
) {
  await queryClient.connect(COSMOS_RPC);
  const res = await queryClient.queryRecordsByFingerprint(
    fingerprint,
    fromSequence
  );

  return res;
}

export async function queryRecordsByOwner(owner: string, fromSequence: number) {
  await queryClient.connect(COSMOS_RPC);
  const res = await queryClient.queryRecordsByOwner(owner, fromSequence);

  return res;
}

export async function queryFeePerByte() {
  await queryClient.connect(COSMOS_RPC);
  const fee = await queryClient.queryFeePerByte();

  return fee;
}

export async function createISCNRecord(
  signer: OfflineSigner,
  ISCNPayload: ISCNSignPayload
) {
  const [from] = await signer.getAccounts();

  await signingClient.connectWithSigner(COSMOS_RPC, signer);
  const res = await signingClient.createISCNRecord(from.address, ISCNPayload);

  return res;
}
