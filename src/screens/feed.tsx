/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  Animated,
  TextInput,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  KeyboardAvoidingView,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import Config from 'react-native-config';
import {ISCNQueryClient} from '@likecoin/iscn-js';
import PostList, {Post} from '../components/PostList';
import CommentInputPopup from '../components/CommentInputPopup';
import HomeNavigationBar from '../components/HomeNavigationBar';
import {SCREEN_HEIGHT, STATUS_BAR_HEIGHT} from '../lib/constants';
import {selectFirstAccountAddress} from '../features/wallet/walletSlice';
import {useAppSelector} from '../hooks';

const FeedScreen = ({navigation}: any) => {
  const firstAccountAddress = useAppSelector(selectFirstAccountAddress);
  const client = new ISCNQueryClient();
  const _loadingDeg = new Animated.Value(0);
  const _scrollRef = useRef<ScrollView>(null);
  const [postList, setPostList] = useState<any>([]);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const _commentInputRef = useRef<TextInput>(null);
  const [showCommentInput, setShowCommentInput] = useState<boolean>(false);

  const ref = useRef<{
    scrollHeight: number;
    preOffsetY: number;
    currentCommentId: string;
    commentContents: {
      id: string;
      content: string;
    }[];
  }>({
    scrollHeight: 0,
    preOffsetY: 0,
    commentContents: [],
    currentCommentId: '0',
  });
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const _startAnimateLoading = () => {
    Animated.timing(_loadingDeg, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      _loadingDeg.setValue(0);
      _startAnimateLoading();
    });
  };
  const _onScroll = ({
    nativeEvent: {
      contentOffset: {y},
      contentSize: {height},
    },
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (
      y / height > 0.45 &&
      y > ref.current.preOffsetY &&
      !loadingMore &&
      !refreshing
    ) {
      (async () => {
        setLoadingMore(true);
        setLoadingMore(false);
      })();
    }
    ref.current.preOffsetY = y;
  };

  const _onFetchIscn = React.useCallback(async () => {
    // Query ISCN by owner
    await client.connect(Config.LIKECOIN_RPC);
    const res: any = await client.queryRecordsByOwner(firstAccountAddress);
    console.log('res', res);
    const posts: Post = res!.records
      .filter((f: any) => f.data.contentMetadata.imageUrls)
      .reverse()
      .map((p: any) => ({
        iscnId: p.data['@id'],
        walletAddress: p.data.contentMetadata.walletAddress,
        caption: p.data.contentMetadata.caption,
        imageUrls: p.data.contentMetadata.imageUrls,
        keywords: p.data.contentMetadata.keywords,
        location: p.data.contentMetadata.location,
        locationId: p.data.contentMetadata.locationId,
        name: p.data.contentMetadata.name,
        usageInfo: p.data.contentMetadata.usageInfo,
        recordNotes: p.data.recordNotes,
        recordTimestamp: p.data.recordTimestamp,
        recordVersion: p.data.recordVersion,
        stakeholders: p.data.stakeholders,
      }));
    setPostList(posts);
  }, [client]);

  const _onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await _onFetchIscn();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    (async () => {
      await _onFetchIscn();
    })();
  }, []);

  const _setCommentContents = (id: string, content: string) => {
    ref.current.commentContents.filter((x) => x.id === id)[0].content = content;
  };

  const _showCommentInput = React.useCallback((id: string, prefix?: string) => {
    if (id !== '0') {
      const check = ref.current.commentContents.every((x, index) => {
        if (x.id.toString() === id) {
          if (prefix) {
            ref.current.commentContents[index].content = prefix;
          }
          return false;
        }
        return true;
      });
      if (check) {
        ref.current.commentContents.push({
          id: id.toString(),
          content: prefix || '',
        });
      }
      ref.current.currentCommentId = id.toString();
      setShowCommentInput(true);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingViewContainer}
        behavior="height">
        <HomeNavigationBar navigation={navigation} />
        <ScrollView
          keyboardDismissMode="on-drag"
          ref={_scrollRef}
          style={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />
          }
          scrollEventThrottle={10}
          onScroll={_onScroll}
          showsVerticalScrollIndicator={false}>
          <PostList
            showCommentInput={_showCommentInput}
            data={postList}
            navigation={navigation}
          />
          <View
            style={{
              ...styles.loadingIcon,
              opacity: loadingMore ? 1 : 0,
            }}>
            {loadingMore && (
              <>
                <Animated.Image
                  onLayout={_startAnimateLoading}
                  style={{
                    width: 30,
                    height: 30,
                    transform: [
                      {
                        rotate: _loadingDeg.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        }),
                      },
                    ],
                  }}
                  source={require('../assets/icons/waiting.png')}
                />
                <Text
                  style={{
                    fontWeight: '500',
                    marginLeft: 5,
                  }}>
                  Loading more...
                </Text>
              </>
            )}
          </View>
        </ScrollView>
        {showCommentInput && (
          <CommentInputPopup
            onDone={setShowCommentInput.bind(null, false)}
            setCommentContents={_setCommentContents}
            id={ref.current.currentCommentId}
            preValue={
              ref.current.commentContents.filter(
                (x) => x.id === ref.current.currentCommentId,
              )[0]?.content || ''
            }
            commentInputRef={_commentInputRef}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default FeedScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  keyboardAvoidingViewContainer: {
    position: 'relative',
  },
  scrollContainer: {
    marginBottom: 20,
    height: SCREEN_HEIGHT + STATUS_BAR_HEIGHT - 150,
  },
  loadingIcon: {
    position: 'relative',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
