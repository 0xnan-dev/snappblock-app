import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { CachedImage, CachedImageProps } from '../CachedImage';
import { Layout } from '../../constants';
export interface ScaleImageProps extends CachedImageProps {
  width?: number;
  height?: number;
  source: {
    uri: string;
  };
}

const SCREEN_WIDTH = Layout.window.width;

export const ScaleImage = React.memo((props: ScaleImageProps) => {
  const [rwidth, setRwidth] = useState<number>(0);
  const [rheight, setRheight] = useState<number>(0);

  useEffect(() => {
    if (props.width && props.height) {
      setRwidth(props.width);
      setRheight(props.height);
    } else {
      Image.getSize(
        props.source.uri,
        (xwidth, xheight) => {
          if (props.width) {
            setRheight((xheight * props.width) / xwidth);
            setRwidth(props.width);
          } else if (props.height) {
            setRwidth((xwidth * props.height) / xheight);
            setRheight(props.height);
          }
        },
        Function
      );
    }
  }, [props]);

  return (
    <CachedImage
      {...props}
      source={{
        uri: props.source.uri,
      }}
      style={[
        props.style,
        {
          width: rwidth > 0 ? rwidth : props.width || SCREEN_WIDTH,
          height: rheight,
        },
      ]}
    />
  );
});
