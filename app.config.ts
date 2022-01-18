/* eslint-disable import/no-extraneous-dependencies */
import dotenv from 'dotenv';

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ({ config }: any) {
  let extra = {
    sentryDsn: process.env.SENTRY_DSN,
    cosmosRpc: process.env.COSMOS_RPC,
    cosmosDenom: process.env.COSMOS_DENOM,
    ipfsApiUrl: process.env.IPFS_API_URL,
    ipfsNodeUrl: process.env.IPFS_NODE_URL,
    authMessage: process.env.AUTH_MESSAGE,
  };

  if (process.env.APP_ENV === 'staging') {
    extra = {
      sentryDsn: process.env.SENTRY_DSN,
      cosmosRpc: process.env.STAG_COSMOS_RPC,
      cosmosDenom: process.env.STAG_COSMOS_DENOM,
      ipfsApiUrl: process.env.STAG_IPFS_API_URL,
      ipfsNodeUrl: process.env.STAG_IPFS_NODE_URL,
      authMessage: process.env.STAG_AUTH_MESSAGE,
    };
  }

  return {
    ...config,
    extra: {
      ...extra,
    },
    hooks: {
      postPublish: [
        {
          file: 'sentry-expo/upload-sourcemaps',
          config: {
            organization: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            authToken: process.env.SENTRY_AUTH_TOKEN,
          },
        },
      ],
    },
  };
}
