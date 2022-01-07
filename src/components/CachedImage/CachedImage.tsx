import React, { FC, useEffect, useState, useRef } from 'react';

import { Image, ImageProps, ImageURISource } from 'react-native';

import * as FileSystem from 'expo-file-system';

export interface CachedImageProps extends ImageProps {
  source: ImageURISource & {
    uri: string;
  };
}

export const CachedImage: FC<CachedImageProps> = ({ ...props }) => {
  const cacheKey = encodeURIComponent(props.source.uri);
  const filesystemURI = `${FileSystem.cacheDirectory}${cacheKey}`;

  const [imgURI, setImgURI] = useState<string | undefined>(filesystemURI);

  const componentIsMounted = useRef(true);

  useEffect(() => {
    const loadImage = async (fileURI: string) => {
      try {
        // Use the cached image if it exists
        const metadata = await FileSystem.getInfoAsync(fileURI);

        if (!metadata.exists) {
          // download to cache
          if (componentIsMounted.current) {
            setImgURI(undefined);
            await FileSystem.downloadAsync(props.source.uri, fileURI);
          }

          if (componentIsMounted.current) {
            setImgURI(fileURI);
          }
        }
      } catch (err) {
        console.log();
        setImgURI(props.source.uri);
      }
    };

    loadImage(filesystemURI);

    return () => {
      componentIsMounted.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <Image {...props} source={{ uri: imgURI }} />;
};
