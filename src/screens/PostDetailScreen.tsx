// src/screens/PostDetailScreen.tsx
import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import PostCardDetailed from '../components/molecules/PostCardDetailed';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';

type PostDetailRouteProp = RouteProp<RootStackParamList, 'PostDetail'>;

const PostDetailScreen: React.FC = () => {
  const route = useRoute<PostDetailRouteProp>();
  const { post } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PostCardDetailed post={post} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default PostDetailScreen;
