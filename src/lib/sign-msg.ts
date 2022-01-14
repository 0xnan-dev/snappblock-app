import { Buffer } from 'buffer';
import secp256k1 from 'secp256k1';
import createHash from 'create-hash';

export const signMsg = (msg: string | Buffer, privateKey: string) => {
  const privateKeyBytes = Buffer.from(privateKey, 'hex');
  const msgSha256 = createHash('sha256');

  msgSha256.update(msg);

  const msgHash = msgSha256.digest();
  const { signature: signatureArr } = secp256k1.ecdsaSign(
    msgHash,
    privateKeyBytes
  );
  const signature = Buffer.from(signatureArr);

  return signature;
};
