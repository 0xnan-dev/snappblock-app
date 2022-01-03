import { polyfillWebCrypto } from 'react-native-crypto-polyfill';

// crypto is now globally defined
polyfillWebCrypto();

global.Buffer = global.Buffer || require('buffer').Buffer;