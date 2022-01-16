import { Buffer } from 'buffer';
import * as bip39 from 'bip39';
import { bech32 } from 'bech32';
import * as bip32 from 'bip32';
import secp256k1 from 'secp256k1';
import * as CryptoJS from 'crypto-js';

const hdPathAtom = `m/44'/118'/0'/0/0`; // key controlling ATOM allocation

export interface KeyPair {
  privateKey: Buffer;
  publicKey: Buffer;
}

export interface Wallet {
  privateKey: string;
  publicKey: string;
  cosmosAddress: string;
  seedPhrase: string;
}

/* tslint:disable-next-line:strict-type-predicates */
const windowObject: Window | null =
  typeof window === 'undefined' ? null : window;

function windowRandomBytes(size: number, window: Window) {
  const chunkSize = size / 4;
  let hexString = '';
  let keyContainer = new Uint32Array(chunkSize);

  keyContainer = window.crypto.getRandomValues(keyContainer);

  for (let keySegment = 0; keySegment < keyContainer.length; keySegment++) {
    let chunk = keyContainer[keySegment].toString(16); // Convert int to hex

    while (chunk.length < chunkSize) {
      // fill up so we get equal sized chunks
      chunk = '0' + chunk;
    }

    hexString += chunk; // join
  }

  return Buffer.from(hexString, 'hex');
}

// returns a byte buffer of the size specified
export function randomBytes(size: number, window = windowObject): Buffer {
  // in browsers
  if (window && window.crypto) {
    return windowRandomBytes(size, window);
  }

  try {
    // native node crypto
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const crypto = require('crypto');

    return crypto.randomBytes(size);
  } catch (err) {
    // no native node crypto available
  }

  throw new Error(
    'There is no native support for random bytes on this system. Key generation is not safe here.'
  );
}

export function deriveMasterKey(mnemonic: string): BIP32Interface {
  // throws if mnemonic is invalid
  bip39.validateMnemonic(mnemonic);

  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const masterKey = bip32.fromSeed(seed);

  return masterKey;
}

export function deriveKeypair(
  masterKey: BIP32Interface,
  hdPath: string
): KeyPair {
  const cosmosHD = masterKey.derivePath(hdPath);
  const privateKey = cosmosHD.privateKey as Buffer;

  const publicKey = secp256k1.publicKeyCreate(privateKey, true);

  return {
    privateKey,
    publicKey: Buffer.from(publicKey),
  };
}

// converts a string to a bech32 version of that string which shows a type and has a checksum
function bech32ify(address: string, prefix: string) {
  const words = bech32.toWords(Buffer.from(address, 'hex'));

  return bech32.encode(prefix, words);
}

// NOTE: this only works with a compressed public key (33 bytes)
export function getCosmosAddress(
  publicKey: Buffer,
  bech32Prefix: string
): string {
  const message = CryptoJS.enc.Hex.parse(publicKey.toString('hex'));
  const address = CryptoJS.RIPEMD160(CryptoJS.SHA256(message)).toString();
  const cosmosAddress = bech32ify(address, bech32Prefix);

  return cosmosAddress;
}

export function getSeed(
  randomBytesFunc: (size: number) => Buffer = randomBytes
): string {
  const entropy = randomBytesFunc(32);

  if (entropy.length !== 32) throw Error(`Entropy has incorrect length`);
  const mnemonic = bip39.entropyToMnemonic(entropy.toString('hex'));

  return mnemonic;
}

export function getNewWalletFromSeed(
  mnemonic: string,
  bech32Prefix: string,
  hdPath: string = hdPathAtom
): Wallet {
  const masterKey = deriveMasterKey(mnemonic);
  const { privateKey, publicKey } = deriveKeypair(masterKey, hdPath);
  const cosmosAddress = getCosmosAddress(publicKey, bech32Prefix);

  return {
    privateKey: privateKey.toString('hex'),
    publicKey: publicKey.toString('base64'),
    cosmosAddress,
    seedPhrase: mnemonic,
  };
}

export function getNewWallet(
  // eslint-disable-next-line @typescript-eslint/default-param-last
  randomBytesFunc: (size: number) => Buffer = randomBytes,
  bech32Prefix: string,
  hdPath: string = hdPathAtom
): Wallet {
  const mnemonic = getSeed(randomBytesFunc);

  return getNewWalletFromSeed(mnemonic, bech32Prefix, hdPath);
}
