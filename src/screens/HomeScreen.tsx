import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import PostCardDetailed from '../components/molecules/PostCardDetailed';
import type { PostModel } from '../types';

import postsJson from '../data/posts.json';

const simulateServerReaction = async (postId: PostModel['id'], type: 'like' | 'dislike') => {
  await new Promise<void>((resolve) => setTimeout(resolve, 350));
  if (Math.random() < 0.05) throw new Error('simulated network error');
  return true;
};

const HomeScreen: React.FC = () => {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
  const navigation = useNavigation<HomeNavProp>();


  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      console.log('📌 Local posts JSON (raw):', postsJson);
      const data = (postsJson as any).posts ?? [];
      const normalized: PostModel[] = data.map((p: any) => ({
        id: p.id,
        title: p.title,
        body: p.body,
        tags: p.tags ?? [],
        reactions: p.reactions ?? { likes: 0, dislikes: 0 },
        views: p.views ?? 0,
        userId: p.userId,
      }));
      setPosts(normalized);
    } catch (err) {
      console.warn('❌ loadPosts error', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  }, [loadPosts]);

  const updateReactionOptimistic = useCallback(
    (postId: PostModel['id'], delta: Partial<PostModel['reactions']>) => {
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, reactions: { ...p.reactions, ...delta } } : p)));
    },
    []
  );

  const handleLike = useCallback(
    async (postId: PostModel['id']) => {
      // optimistic: increment likes
      updateReactionOptimistic(postId, { likes: (posts.find((p) => p.id === postId)?.reactions.likes ?? 0) + 1 });

      try {
        await simulateServerReaction(postId, 'like');
      } catch (e) {
        // rollback
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, reactions: { ...p.reactions, likes: Math.max((p.reactions.likes || 1) - 1, 0) } } : p
          )
        );
      }
    },
    [updateReactionOptimistic, posts]
  );

  const handleDislike = useCallback(
    async (postId: PostModel['id']) => {
      updateReactionOptimistic(postId, { dislikes: (posts.find((p) => p.id === postId)?.reactions.dislikes ?? 0) + 1 });

      try {
        await simulateServerReaction(postId, 'dislike');
      } catch (e) {
        // rollback
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, reactions: { ...p.reactions, dislikes: Math.max((p.reactions.dislikes || 1) - 1, 0) } } : p
          )
        );
      }
    },
    [updateReactionOptimistic, posts]
  );

  const renderItem = useCallback(
    ({ item }: { item: PostModel }) => (
      <PostCardDetailed
        post={item}
        onLike={handleLike}
        onDislike={handleDislike}
        onPress={() => navigation.navigate('PostDetail', { post: item })}
      />
    ),
    [handleLike, handleDislike, navigation]
  );



  const keyExtractor = useCallback((item: PostModel) => String(item.id), []);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {loading && posts.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      ) : null}

      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={9}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              {/* Reusable empty state could go here */}
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F8FA' },
  listContent: { padding: 4, paddingBottom: 12 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { padding: 12, alignItems: 'center' },
});

export default HomeScreen;
