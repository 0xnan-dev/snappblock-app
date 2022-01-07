/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Layout } from '../../constants';

const SCREEN_WIDTH = Layout.window.width;

export interface CirclePaginationProps {
  maxPage: number;
  currentPage: number;
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    marginHorizontal: 2,
    borderRadius: 8,
  },
});

export const CirclePagination = React.memo(
  ({ maxPage, currentPage }: CirclePaginationProps) => {
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const circleArr = [...Array(maxPage + 1).keys()].splice(1, maxPage);
    const handleOnLayoutHandler = ({
      nativeEvent: {
        layout: { width },
      },
    }: LayoutChangeEvent) => {
      setContainerWidth(width);
    };
    return (
      <View
        onLayout={handleOnLayoutHandler}
        style={{
          ...styles.container,
          left: (SCREEN_WIDTH - containerWidth) / 2,
        }}
      >
        {circleArr.map((circle, index) => (
          <View
            key={index}
            style={{
              ...styles.circle,
              backgroundColor: currentPage === circle ? '#318bfb' : '#ddd',
              width: currentPage === circle ? 8 : 6,
              height: currentPage === circle ? 8 : 6,
            }}
          />
        ))}
      </View>
    );
  }
);
