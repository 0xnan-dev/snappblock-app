/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef } from 'react';
import { Layout } from '../../constants';
import {
  ImageBackground,
  Text,
  ScrollView,
  StyleSheet,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
} from 'react-native';

import { ScaleImage } from '../ScaleImage';
// import {PostImage} from '../../reducers/postReducer';
import { CachedImage } from '../CachedImage';
// import {store} from '../../store';
// import {navigate} from '../../navigations/rootNavigation';
export interface PhotoShowerProps {
  sources: any;
  onChangePage?: (page: number) => any;
  navigation: any;
}

const SCREEN_WIDTH = Layout.window.width;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  paging: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 5,
    paddingHorizontal: 10,
    zIndex: 99,
    borderRadius: 50,
    top: 10,
    right: 10,
  },
  label: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    zIndex: 1,
    borderRadius: 5,
  },
});

export const PhotoShower = React.memo(
  ({ sources, onChangePage }: PhotoShowerProps) => {
    const maxImageHeight = SCREEN_WIDTH;
    // const myUsername = ''; //store.getState().user.user.userInfo?.username || '';
    // const maxImageHeight = Math.max(
    //   ...sources.map((img: any) => {
    //     if (img.fullSize) {
    //       return SCREEN_WIDTH;
    //     } else {
    //       return (img.height * SCREEN_WIDTH) / img.width;
    //     }
    //   }),
    // );
    const [currentPage, setCurrentPage] = useState<number>(1);
    const scrollRef = useRef<ScrollView>(null);
    const handleOnEndDragHandler = ({
      nativeEvent: {
        contentOffset: { x },
      },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currIndex = Math.floor(x / SCREEN_WIDTH);
      const offsetXpercent =
        (x - Math.floor(x / SCREEN_WIDTH) * SCREEN_WIDTH) / SCREEN_WIDTH;

      if (offsetXpercent > 0.5) {
        scrollRef.current?.scrollTo({
          x: (currIndex + 1) * SCREEN_WIDTH,
          y: 0,
          animated: true,
        });
        if (onChangePage) {
          onChangePage(currIndex + 2);
        }

        setCurrentPage(currIndex + 2);
      } else {
        scrollRef.current?.scrollTo({
          x: currIndex * SCREEN_WIDTH,
          y: 0,
          animated: true,
        });
        if (onChangePage) {
          onChangePage(currIndex + 1);
        }

        setCurrentPage(currIndex + 1);
      }
    };

    return (
      <View style={styles.container}>
        {sources.length > 1 && (
          <View style={styles.paging}>
            <Text
              style={{
                fontWeight: '600',
                color: '#fff',
              }}
            >
              {currentPage}/{sources?.length}
            </Text>
          </View>
        )}
        <ScrollView
          ref={scrollRef}
          onScrollEndDrag={handleOnEndDragHandler}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          horizontal={true}
        >
          {sources &&
            sources.map((img: any, index: any) => (
              <TouchableOpacity key={index} activeOpacity={1}>
                <ImageBackground
                  source={{ uri: img }}
                  blurRadius={20}
                  style={{
                    height: maxImageHeight,
                    width: SCREEN_WIDTH,
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View>
                    {img ? (
                      <CachedImage
                        style={{
                          width: SCREEN_WIDTH,
                          height: SCREEN_WIDTH,
                        }}
                        source={{ uri: img }}
                      />
                    ) : (
                      <ScaleImage
                        height={SCREEN_WIDTH}
                        width={SCREEN_WIDTH}
                        source={{ uri: img }}
                      />
                    )}
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    );
  }
);
