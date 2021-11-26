import React, {createContext, useState} from 'react';
import IpfsHttpClient from 'ipfs-http-client';
import Config from 'react-native-config';
interface IContextProps {
  client: any;
}

export const IpfsHttpClientContext = createContext<IContextProps>(
  {} as IContextProps,
);

const IpfsProvider = ({children}: any) => {
  const [client] = useState(
    IpfsHttpClient({
      host: Config.PLATFORM_IPFS_HTTP_CLIENT_HOST,
      port: parseInt(Config.PLATFORM_IPFS_HTTP_CLIENT_PORT),
      protocol: Config.PLATFORM_IPFS_HTTP_CLIENT_PROTOCOL,
      apiPath: '/ipfs/api/v0',
    }),
  );

  return (
    <IpfsHttpClientContext.Provider value={{client}}>
      {children}
    </IpfsHttpClientContext.Provider>
  );
};

const useIpfs = () => React.useContext(IpfsHttpClientContext);

export {IpfsProvider, useIpfs};
