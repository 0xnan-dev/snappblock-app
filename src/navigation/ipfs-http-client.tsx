import React, { createContext, useState } from 'react';
import IpfsHttpClient from 'ipfs-http-client';
import { PLATFORM_IPFS_HTTP_CLIENT_PROTOCOL, PLATFORM_IPFS_HTTP_CLIENT_PORT, PLATFORM_IPFS_HTTP_CLIENT_HOST } from '../lib/config';

interface IContextProps {
  client: any
}

export const IpfsHttpClientContext = createContext<IContextProps>({} as IContextProps);

const IpfsProvider = ({ children }:any) => {

  const [client] = useState(IpfsHttpClient(
      {
        host: PLATFORM_IPFS_HTTP_CLIENT_HOST,
        port: PLATFORM_IPFS_HTTP_CLIENT_PORT,
        protocol: PLATFORM_IPFS_HTTP_CLIENT_PROTOCOL,
        // apiPath: '/ipfs/api/v0',
      }
    )
  );

  return (
    <IpfsHttpClientContext.Provider value={{client}}>
      {children}
    </IpfsHttpClientContext.Provider>
  );
};

const useIpfs = () => React.useContext(IpfsHttpClientContext);

export {
  IpfsProvider, useIpfs
};
