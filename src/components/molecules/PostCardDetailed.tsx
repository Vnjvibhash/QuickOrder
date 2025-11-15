import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  AccessibilityRole,
} from 'react-native';
import { useTheme } from '../../theme';
import Tag from '../atoms/Tag';
import ReactionBar from '../atoms/ReactionBar';

// import the single PostModel type
import type { PostModel } from '../../types';

type Props = {
  post: PostModel;
  onLike?: (postId: PostModel['id']) => void;
  onDislike?: (postId: PostModel['id']) => void;
  onPress?: (postId: PostModel['id']) => void;
};

const PLACEHOLDER_AVATAR = require('../../assets/icons/avatar.png');

const PostCardDetailed: React.FC<Props> = ({ post, onLike, onDislike, onPress }) => {
  const { width } = useWindowDimensions();
  const isLarge = width >= 600;
  const theme = useTheme();

  const styles = useMemo(() => createStyles(isLarge, theme), [isLarge, theme]);

  const handleLike = () => onLike?.(post.id);
  const handleDislike = () => onDislike?.(post.id);
  const handlePress = () => onPress?.(post.id);

  return (
    <TouchableOpacity
      activeOpacity={0.98}
      onPress={handlePress}
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      accessibilityRole={'button' as AccessibilityRole}
      accessibilityLabel={`post ${post.title}`}
    >
      <View style={styles.headerRow}>
        <Image source={PLACEHOLDER_AVATAR} style={styles.avatar} accessibilityLabel="author avatar" />
        <View style={styles.headerText}>
          <Text style={styles.authorName}>User #{post.userId ?? '—'}</Text>
          <Text style={styles.metaText}>{post.tags?.[0] ?? ''}</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {post.title}
      </Text>

      <Text style={styles.body} numberOfLines={isLarge ? 6 : 4}>
        {post.body}
      </Text>

      {post.tags && post.tags.length > 0 ? (
        <View style={styles.tagsRow}>
          {post.tags.map((t) => (
            <Tag key={t} style={{ marginBottom: 8 }}>
              {t}
            </Tag>
          ))}
        </View>
      ) : null}

      <ReactionBar
        likes={post.reactions.likes}
        dislikes={post.reactions.dislikes}
        views={post.views}
        onLike={handleLike}
        onDislike={handleDislike}
      />
    </TouchableOpacity>
  );
};

function createStyles(isLarge: boolean, theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    container: {
      borderRadius: 12,
      padding: isLarge ? 20 : 14,
      marginVertical: 10,
      marginHorizontal: 16,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    avatar: {
      width: isLarge ? 56 : 44,
      height: isLarge ? 56 : 44,
      borderRadius: isLarge ? 28 : 22,
      marginRight: 12,
      backgroundColor: theme.colors.surface2,
    },
    headerText: { flexDirection: 'column' },
    authorName: { fontSize: isLarge ? 16 : 14, fontWeight: '700', color: theme.colors.textPrimary },
    metaText: { fontSize: 12, color: theme.colors.textMuted, marginTop: 2 },

    title: {
      marginTop: 4,
      fontSize: isLarge ? 20 : 16,
      fontWeight: '800',
      color: theme.colors.textPrimary,
      marginBottom: 8,
    },
    body: {
      fontSize: isLarge ? 16 : 14,
      color: theme.colors.textPrimary,
      lineHeight: isLarge ? 22 : 20,
      marginBottom: 10,
    },
    tagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 6,
    },
  });
}

export default React.memo(PostCardDetailed);
