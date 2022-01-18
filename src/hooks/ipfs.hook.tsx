import React, { FC, createContext, useContext } from 'react';
import * as Sentry from 'sentry-expo';
import ExpoConstants from 'expo-constants';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { signMsg } from '../lib/sign-msg';

const isDev = process.env.NODE_ENV !== 'production';
const ipfsApiUrl = ExpoConstants.manifest?.extra?.ipfsApiUrl;
const authMessage = ExpoConstants.manifest?.extra?.authMessage;

interface IPFSContextProps {
  authorize: (publicKey: string, pirvateKey: string) => Promise<string | void>;
  upload: (fileUri: string, accessToken: string) => Promise<string>; // return IPFS path
  download: (ipfsPath: string, accessToken: string) => Promise<ArrayBuffer>;
}

type AuthenticatonType = {
  accessToken: string;
  expiresIn: string;
};

async function dataURItoBlob(dataURI: string) {
  let myDataUri = dataURI;

  if (Platform.OS === 'ios') {
    const base64Response = await FileSystem.readAsStringAsync(dataURI, {
      encoding: FileSystem.EncodingType.Base64,
    });

    myDataUri = `data:image/jpg;base64,${base64Response}`;
  }

  const response = await fetch(myDataUri);
  const blob = await response.blob();

  return blob;
}

export const IPFSContext = createContext<IPFSContextProps>({
  authorize: null as never,
  upload: null as never,
  download: null as never,
});

const captureException = (err: unknown, extra?: Record<string, string>) => {
  const extraData = {
    APP_ENV: process.env.APP_ENV,
    NODE_ENV: process.env.NODE_ENV,
  };

  if (isDev) {
    console.error(err, extra);

    return;
  }

  if (Platform.OS === 'web') {
    return Sentry.Browser.captureException(err, scope => {
      scope.setExtras({
        ...extraData,
        ...extra,
      });

      return scope;
    });
  }

  return Sentry.Native.captureException(err, scope => {
    scope.setExtras({
      ...extraData,
      ...extra,
    });

    return scope;
  });
};

export const IPFSProvider: FC = ({ children }) => {
  const authorize = async (
    publicKey: string, // base64 string
    pirvateKey: string // hex string
  ): Promise<string | void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const signature = signMsg(authMessage!, pirvateKey); // base64 signature
      const apiRes = await axios.post<AuthenticatonType>(
        `${ipfsApiUrl}/v1/auth/login`,
        {
          publicKey,
          signature: signature.toString('base64'),
        }
      );

      return apiRes.data.accessToken;
    } catch (ex) {
      captureException(ex, {
        publicKey,
        authMessage,
        url: `${ipfsApiUrl}/v1/auth/login`,
      });
    }
  };

  const upload = async (fileUri: string, accessToken: string) => {
    const formData = new FormData();
    const imageBlob = await dataURItoBlob(fileUri);

    if (!imageBlob) {
      throw new Error();
    }

    formData.append('file', imageBlob);

    const apiRes = await axios.post<string>(`${ipfsApiUrl}/ipfs`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return apiRes.data;
  };

  const download = async (ipfsPath: string, accessToken: string) => {
    const apiRes = await axios.get(`${ipfsApiUrl}/ipfs/${ipfsPath}`, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return apiRes.data;
  };

  return (
    <IPFSContext.Provider
      value={{
        authorize,
        upload,
        download,
      }}
    >
      {children}
    </IPFSContext.Provider>
  );
};

export const useIPFS = () => {
  const context = useContext(IPFSContext);

  return context;
};
