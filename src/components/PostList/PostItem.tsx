/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  default as Icon,
  default as Icons,
} from 'react-native-vector-icons/MaterialCommunityIcons';
// import {useDispatch} from 'react-redux';
// import {ToggleLikePostRequest} from '../../actions/postActions';
// import {ToggleBookMarkRequest} from '../../actions/userActions';
// import {navigate, navigation} from '../../navigations/rootNavigation';
// import {useSelector} from '../../reducers';
// import {ExtraPost} from '../../reducers/postReducer';
// import {store} from '../../store';
import {SCREEN_WIDTH} from '../../lib/constants';
import {timestampToString} from '../../lib/utils';
import CirclePagination from '../CirclePagination';
import PhotoShower from './PhotoShower';
import SVG from '../Avatar';
import {Post} from './index';

export interface PostItemProps {
  item: Post;
  navigation: any;
  showCommentInput?: (id: string, prefix?: string) => void;
  setPost?: React.Dispatch<React.SetStateAction<any>>;
}

const PostItem = ({
  setPost,
  item,
  showCommentInput,
  navigation,
}: PostItemProps) => {
  const myUsername = ''; //store.getState().user.user.userInfo?.username;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const bookmarks: any = [];
  const [content, setContent] = useState<JSX.Element[]>([]);
  const user: any = {}; //useSelector((state) => state.user.user);
  const _animBookmarkNotification = React.useMemo(
    () => new Animated.Value(0),
    [],
  );
  const isLiked =
    item?.likes && item?.likes?.indexOf(user?.userInfo?.username || '') > -1;
  const _onChangePageHandler = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setContent(createFilterContent(item.caption || '', navigation));
  }, [item, navigation]);

  const _toggleLikePost = () => {};

  let diffTime: string = timestampToString(
    new Date(item?.recordTimestamp)?.getTime() || 0,
    true,
  );

  const _onViewAllComments = () => {
    navigation.navigate('Comment', {
      postId: item.iscnId,
      ...(setPost ? {postData: {...item}} : {}),
    });
  };

  const _onToggleBookmark = () => {
    const isBookmarked = !!bookmarks.find((x: any) => x.postId === item.iscnId);
    if (!isBookmarked) {
      Animated.sequence([
        Animated.timing(_animBookmarkNotification, {
          toValue: -44,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(_animBookmarkNotification, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const isBookmarked = !!bookmarks.find((x: any) => x.postId === item.iscnId);

  return (
    <View style={styles.container}>
      <View style={styles.postHeader}>
        <View style={styles.postSubHeader}>
          <TouchableOpacity
            onPress={() =>
              myUsername === item.walletAddress
                ? navigation.navigate('AccountIndex')
                : navigation.navigate('ProfileX', {
                    username: item.walletAddress,
                  })
            }
            style={styles.infoWrapper}>
            {/* <FastImage
              style={styles.avatar}
              source={{uri: item.walletAddress}}
            /> */}
            <SVG />

            <Text
              style={{
                fontWeight: '600',
              }}>
              {item.walletAddress?.slice(0, 20)}
            </Text>
          </TouchableOpacity>
          <View style={styles.infoWrapper}>
            {(item.location || '').length > 0 && (
              <View
                style={{
                  marginRight: 5,
                  width: 30,
                  height: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="map-marker" color="#318bfb" size={20} />
              </View>
            )}
            <Text
              numberOfLines={2}
              style={{
                fontSize: 16,
                color: (item.location || '').length > 0 ? '#318bfb' : '#000',
                width: SCREEN_WIDTH - 30 - 30 - 30,
              }}>
              {(item.location || '').length > 20
                ? item.location.slice(0, 20) + '...'
                : item.location.slice}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.push('PostOptions', {
              item,
              setPost,
            })
          }>
          <Icons name="dots-vertical" size={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <PhotoShower
          onChangePage={_onChangePageHandler}
          sources={item.imageUrls || []}
          navigation={navigation}
        />
        <Animated.View
          style={{
            ...styles.bookmarkAddionNotification,
            transform: [
              {
                translateY: _animBookmarkNotification,
              },
            ],
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <FastImage
              source={{
                uri: (item.imageUrls || [])[0],
              }}
              style={styles.bookmarkPreviewImage}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                marginHorizontal: 10,
              }}>
              Saved
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Saved');
            }}
            style={styles.btnGoToSaved}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: '#318bfb',
              }}>
              See All
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      <View style={styles.reactionsWrapper}>
        <View style={styles.reactions}>
          <View style={styles.lReactions}>
            <TouchableOpacity onPress={_toggleLikePost}>
              <Icons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={24}
                color={isLiked ? 'red' : '#000'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={_onViewAllComments}>
              <Icon name="comment-outline" size={22} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ShareToDirect', {
                  item: {...item},
                })
              }>
              <Image
                style={{
                  height: 20,
                  width: 20,
                }}
                source={require('../../assets/icons/send.png')}
              />
            </TouchableOpacity>
          </View>
          {item.imageUrls && item.imageUrls.length > 1 && (
            <CirclePagination
              maxPage={item.imageUrls?.length || 0}
              currentPage={currentPage}
            />
          )}
          <TouchableOpacity activeOpacity={0.7} onPress={_onToggleBookmark}>
            <Image
              style={{
                height: 24,
                width: 24,
              }}
              source={
                isBookmarked
                  ? require('../../assets/icons/bookmarked.png')
                  : require('../../assets/icons/bookmark.png')
              }
            />
          </TouchableOpacity>
        </View>
        {item?.likes && item?.likes.length !== 0 && (
          <Text
            style={{
              fontWeight: 'bold',
              marginVertical: 5,
            }}>
            {item?.likes.length >= 1000
              ? Math.round(item?.likes.length / 1000) + 'k'
              : item?.likes.length}{' '}
            {item?.likes.length < 2 ? 'like' : 'likes'}
          </Text>
        )}

        <View
          style={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontWeight: '600',
              marginVertical: 5,
            }}>
            {item.walletAddress?.slice(0, 20)}{' '}
          </Text>
          {content.map((Jsx) => Jsx)}
        </View>
        {item?.comments && item?.comments.length > 0 && (
          <>
            <View>
              <Text
                style={{
                  fontWeight: '600',
                  marginVertical: 5,
                }}>
                {item.comments[0].userId}{' '}
                <Text
                  style={{
                    fontWeight: '400',
                  }}>
                  {item.comments[0].content}
                </Text>
              </Text>
            </View>
            <TouchableOpacity
              onPress={_onViewAllComments}
              style={styles.btnViewCmt}>
              <Text
                style={{
                  color: '#666',
                }}>
                View all {item.comments.length} comments
              </Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          onPress={() => {
            if (showCommentInput) {
              showCommentInput(item.iscnId || '0');
            }
          }}
          activeOpacity={1}
          style={styles.commentInputWrapper}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FastImage
              source={{
                uri: user.userInfo?.avatarURL,
                priority: FastImage.priority.high,
              }}
              style={styles.commentAvatar}
            />
            <Text
              style={{
                color: '#666',
                marginHorizontal: 10,
              }}>
              Add a comment...
            </Text>
          </View>
          <View style={styles.commentIconsWrapper}>
            <TouchableOpacity
              onPress={() => {
                if (showCommentInput) {
                  showCommentInput(item.iscnId || '0', '❤');
                }
              }}>
              <Text
                style={{
                  fontSize: 10,
                }}>
                ❤
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (showCommentInput) {
                  showCommentInput(item.iscnId || '0', '🙌');
                }
              }}>
              <Text
                style={{
                  fontSize: 10,
                }}>
                🙌
              </Text>
            </TouchableOpacity>
            <Icons name="plus-circle-outline" color="#666" />
          </View>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 5,
          }}>
          <Text
            style={{
              fontSize: 12,
              color: '#666',
            }}>
            {diffTime}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: '#666',
            }}>
            {' '}
            •{' '}
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                fontSize: 12,
                color: '#318bfb',
                fontWeight: '500',
              }}>
              See Translation
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default React.memo(PostItem);

const styles = StyleSheet.create({
  container: {},
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderTopColor: '#ddd',
    borderTopWidth: 0.5,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  postSubHeader: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 10,
  },
  infoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  body: {
    overflow: 'hidden',
  },
  bookmarkAddionNotification: {
    position: 'absolute',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    width: '100%',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    bottom: -44,
    left: 0,
  },
  btnGoToSaved: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkPreviewImage: {
    height: 30,
    width: 30,
    borderRadius: 5,
  },
  reactionsWrapper: {
    padding: 10,
  },
  reactions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lReactions: {
    flexDirection: 'row',
    width: 24.3 * 3 + 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnViewCmt: {
    marginVertical: 5,
  },
  commentInputWrapper: {
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  commentIconsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 14.3 * 3 + 15,
  },
  commentAvatar: {
    width: 24,
    height: 24,
    borderRadius: 24,
  },
});
export function createFilterContent(content: string, navigation: any) {
  const myUsername = ''; //store.getState().user.user.userInfo?.username || '';
  const matchedGroups: {
    match: string;
    index: number;
  }[] = [];
  content?.replace(/@[a-zA-Z0-9._]{4,}|\w+/g, (match, index) => {
    matchedGroups.push({match, index});
    return match;
  });
  let splitedContent: JSX.Element[] = (content?.split('') || []).map((c, i) => (
    <Text key={i}>{c}</Text>
  ));
  let i = 0;
  matchedGroups.map((match) => {
    splitedContent.splice(match.index - i + 1, match.match.length - 1);
    splitedContent[match.index - i] = (
      <TouchableOpacity
        onPress={() => {
          const targetName = match.match.slice(-(match.match.length - 1));
          if (match.match[0] === '@') {
            if (myUsername !== targetName) {
              navigation.navigate('ProfileX', {
                username: targetName,
              });
            } else {
              navigation.navigate('Account');
            }
          } else if (match.match[0] === '#') {
            navigation.navigate('Hashtag', {
              hashtag: match.match,
            });
          }
        }}
        key={`${match.match}${match.index}`}>
        <Text
          style={{
            color: '#318bfb',
            fontWeight: '500',
          }}>
          {match.match}
        </Text>
      </TouchableOpacity>
    );
    i += match.match.length - 1;
  });
  return splitedContent;
}
