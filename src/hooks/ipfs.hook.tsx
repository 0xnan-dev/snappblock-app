import React, { FC, createContext, useContext } from 'react';
import ExpoConstants from 'expo-constants';
import axios from 'axios';
import { signMsg } from '../lib/sign-msg';
import { captureException, captureMessage } from '../lib';

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

export const IPFSContext = createContext<IPFSContextProps>({
  authorize: null as never,
  upload: null as never,
  download: null as never,
});

async function dataURItoBlob(dataURI: string) {
  const response = await fetch(dataURI);
  const blob = await response.blob();

  return blob;
}

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

    if (/^data/.test(fileUri)) {
      const imageBlob = await dataURItoBlob(fileUri);

      if (!imageBlob) {
        throw new Error();
      }

      formData.append('file', imageBlob);
    } else if (/^file/.test(fileUri)) {
      const type = fileUri.substring(fileUri.lastIndexOf('.') + 1);

      formData.append('file', {
        uri: fileUri,
        name: 'file',
        type: `image/${type}`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    } else {
      throw new Error('Image type not supported');
    }

    // send message to Sentry
    captureMessage('upload()', {
      apiUrl: `${ipfsApiUrl}/ipfs`,
      fileUri: fileUri,
    });

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
