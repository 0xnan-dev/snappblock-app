import { Platform } from 'react-native';

const PLATFORM_IPFS_HTTP_CLIENT_HOST = Platform.select({
  ios: 'localhost',
  android: '10.0.2.2',
});

const PLATFORM_IPFS_HTTP_CLIENT_PORT = 5002;

const PLATFORM_IPFS_HTTP_CLIENT_PROTOCOL = 'http';

export {
  PLATFORM_IPFS_HTTP_CLIENT_HOST,
  PLATFORM_IPFS_HTTP_CLIENT_PORT,
  PLATFORM_IPFS_HTTP_CLIENT_PROTOCOL
};
