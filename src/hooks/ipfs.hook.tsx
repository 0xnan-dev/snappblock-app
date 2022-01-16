import React, { FC, createContext, useContext } from 'react';
import ExpoConstants from 'expo-constants';
import axios from 'axios';
import { signMsg } from '../lib/sign-msg';

const ipfsApiUrl = ExpoConstants.manifest?.extra?.ipfsApiUrl;
const authMessage = ExpoConstants.manifest?.extra?.authMessage;

interface IPFSContextProps {
  authorize: (publicKey: string, pirvateKey: string) => Promise<string | null>;
  upload: (fileUri: string, accessToken: string) => Promise<string>; // return IPFS path
  download: (ipfsPath: string, accessToken: string) => Promise<ArrayBuffer>;
}

type AuthenticatonType = {
  accessToken: string;
  expiresIn: string;
};

async function dataURItoBlob(dataURI: string) {
  const response = await fetch(dataURI);
  const blob = await response.blob();

  return blob;
}

export const IPFSContext = createContext<IPFSContextProps>({
  authorize: null as never,
  upload: null as never,
  download: null as never,
});

export const IPFSProvider: FC = ({ children }) => {
  const authorize = async (
    publicKey: string, // base64 string
    pirvateKey: string // hex string
  ): Promise<string | null> => {
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
      return null;
    }
  };

  const upload = async (fileUri: string, accessToken: string) => {
    const formData = new FormData();
    const imageBlob = await dataURItoBlob(fileUri);

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
