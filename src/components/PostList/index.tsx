import React from 'react';
import {StyleSheet, View} from 'react-native';
// import {PostList} from '../../reducers/postReducer';
import PostItem from './PostItem';

export interface PostListProps {
  data: Post[];
  navigation: any;
  showCommentInput: (id: string, prefix?: string) => void;
}

export interface Post {
  iscnId: string;
  walletAddress: string;
  caption: string;
  imageUrls: string[];
  keywords: string;
  location: string;
  locationId: string;
  name: string;
  usageInfo: string;
  recordNotes: string;
  recordTimestamp: string;
  recordVersion: number;
  stakeholders: any;
  userId?: string;
  content?: string;
  uid?: number;
  isVideo?: boolean;
  likes?: string[];
  commentList?: string[];
  permission?: number;
  create_at?: number;
  source?: PostImage[];
  comments?: Comment[];
  tags?: string[];
  labels?: string[];
  tagUsername?: string[];
  notificationUsers?: string[];
  altText?: string;
  address?: any;
  hashtags?: string[];
}

export interface PostImage {
  uri: string;
  width: number;
  height: number;
  extension: string;
  fullSize: boolean;
  tags: {
    x: number;
    y: number;
    width: number;
    height: number;
    username: string;
  }[];
}

export interface Comment {
  content?: string;
  uid?: number;
  userId?: string;
  likes?: string[];
  create_at?: string;
}

const Post = ({data, showCommentInput, navigation}: PostListProps) => {
  return (
    <View style={styles.container}>
      {data.map((post: Post, index: number) => (
        <PostItem
          showCommentInput={showCommentInput}
          navigation={navigation}
          key={index}
          item={post}
        />
      ))}
    </View>
  );
};

export default React.memo(Post);

const styles = StyleSheet.create({
  container: {},
});
