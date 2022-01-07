/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { CachedImage } from '../CachedImage';

export interface CustomAccountIconProps {
  focused: boolean;
}

const styles = StyleSheet.create({
  avatar: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
    borderColor: '#000',
  },
  popupBookmark: {
    position: 'absolute',
    backgroundColor: 'red',
    height: 50,
    width: 50,
    borderRadius: 5,
    overflow: 'hidden',
    top: -60,
    borderColor: '#ddd',
    borderWidth: 0.5,
  },
});

const CustomAccountIcon = ({ focused }: CustomAccountIconProps) => {
  const user: any = {}; // useSelector((state) => state.user.user.userInfo);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const collectionAll: any = { bookmarks: [] };
  const anim = React.useMemo(() => new Animated.Value(0), []);
  const ref = useRef<{
    preBoormarkCount: number;
    animating: boolean;
  }>({
    preBoormarkCount: 0,
    animating: false,
  });
  const handleOnAnimation = React.useCallback(() => {
    Animated.sequence([
      Animated.timing(anim, {
        duration: 500,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(anim, {
        duration: 400,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start(() => (ref.current.animating = false));
  }, [anim]);

  useEffect(() => {
    const nextCount = collectionAll.bookmarks.length;

    if (nextCount > ref.current.preBoormarkCount && !ref.current.animating) {
      ref.current.animating = true;
      handleOnAnimation();
    }

    ref.current.preBoormarkCount = nextCount;
  }, [handleOnAnimation, collectionAll]);

  return (
    <React.Fragment>
      <Animated.View
        style={{
          ...styles.popupBookmark,
          transform: [
            {
              scale: anim,
            },
          ],
        }}
      >
        <CachedImage
          source={{
            uri: [...collectionAll.bookmarks].pop()?.previewUri,
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </Animated.View>
      <View
        style={{
          height: 24,
          width: 24,
          borderRadius: 24,
          padding: 2,
          borderWidth: focused ? 1 : 0,
        }}
      >
        <CachedImage
          style={styles.avatar}
          source={{
            uri: user?.avatarURL,
          }}
        />
      </View>
    </React.Fragment>
  );
};

export default CustomAccountIcon;
