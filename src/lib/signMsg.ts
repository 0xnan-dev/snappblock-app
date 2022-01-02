import secp256k1 from 'secp256k1';
import { Buffer } from 'buffer';
import createHash from 'create-hash';

export const signMsg = (msg: Buffer, privateKey: Buffer) => {
  const msgSha256 = createHash('sha256');

  msgSha256.update(msg);

  const msgHash = msgSha256.digest();
  const { signature: signatureArr } = secp256k1.ecdsaSign(msgHash, privateKey);
  const signature = Buffer.from(signatureArr);

  return signature;
};
