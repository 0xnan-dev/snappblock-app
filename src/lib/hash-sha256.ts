import { Buffer } from 'buffer';
import createHash from 'create-hash';

export const hashSha256 = (body: string | Buffer): string => {
  const msgSha256 = createHash('sha256');

  msgSha256.update(body);

  const msgHash = msgSha256.digest();
  const msgHashString = msgHash.toString('hex');

  return msgHashString;
};
