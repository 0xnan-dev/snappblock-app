/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';

const ImageChooserMask = ({
  width,
  height,
  maskColor,
}: {
  maskColor: string;
  width: number;
  height: number;
}) => {
  return (
    <View
      style={{
        width,
        height,
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderColor: maskColor,
        borderWidth: 1,
      }}>
      {[0, 0, 0, 0, 0, 0, 0, 0, 0].map((x, index) => (
        <View
          key={index}
          style={{
            width: width / 3 - 2 / 3,
            height: height / 3 - 2 / 3,
            borderColor: maskColor,
            borderWidth: 1,
          }}
        />
      ))}
    </View>
  );
};

export default ImageChooserMask;
