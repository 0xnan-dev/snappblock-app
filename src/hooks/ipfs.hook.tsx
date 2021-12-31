import React, {FC, createContext, useContext} from 'react';
import Config from 'react-native-config';
import axios from 'axios';

interface IPFSContextProps {
  upload: (fileUri: string) => Promise<string>; // return IPFS path
  download: (ipfsPath: string) => Promise<ArrayBuffer>;
}

export const IPFSContext = createContext<IPFSContextProps>({
  upload: async () => '',
  download: async () => Buffer.from(''),
});

export const IPFSProvider: FC = ({children}) => {
  const IPFS_API = Config.IPFS_API;

  const upload = async (fileUri: string) => {
    const formData = new FormData();

    formData.append('file', {
      uri: fileUri,
      type: 'image/jpeg',
      name: 'snapshot.jpg',
    });

    const apiRes = await axios.post(`${IPFS_API}/ipfs`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return apiRes.data;
  };

  const download = async (ipfsPath: string) => {
    const apiRes = await axios.get(`${IPFS_API}/ipfs/${ipfsPath}`, {
      responseType: 'arraybuffer',
    });

    return apiRes.data;
  };

  return (
    <IPFSContext.Provider
      value={{
        upload,
        download,
      }}>
      {children}
    </IPFSContext.Provider>
  );
};

export const useIPFS = () => {
  const context = useContext(IPFSContext);

  return context;
};
