import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AccessibilityRole } from 'react-native';
import { useTheme } from '../../theme';

type Props = {
  likes: number;
  dislikes: number;
  views: number;
  onLike?: () => void;
  onDislike?: () => void;
};

const ReactionBar: React.FC<Props> = ({ likes, dislikes, views, onLike, onDislike }) => {
  const theme = useTheme();

  const handleLike = useCallback(() => {
    onLike?.();
  }, [onLike]);

  const handleDislike = useCallback(() => {
    onDislike?.();
  }, [onDislike]);

  return (
    <View style={styles.container} accessible accessibilityRole="toolbar" accessibilityLabel="reactions toolbar">
      <TouchableOpacity
        style={[styles.pill, { borderColor: theme.colors.primary }]}
        onPress={handleLike}
        accessibilityRole={'button' as AccessibilityRole}
        accessibilityLabel={`like ${likes}`}
      >
        <Text style={[styles.pillText, { color: theme.colors.primary }]}>👍 {likes}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.pill, { borderColor: theme.colors.error }]}
        onPress={handleDislike}
        accessibilityRole={'button' as AccessibilityRole}
        accessibilityLabel={`dislike ${dislikes}`}
      >
        <Text style={[styles.pillText, { color: theme.colors.error }]}>👎 {dislikes}</Text>
      </TouchableOpacity>

      <View style={styles.views}>
        <Text style={[styles.viewsText, { color: theme.colors.textMuted }]} accessibilityLabel={`views ${views}`}>
          👁️ {views}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  pillText: { fontSize: 13, fontWeight: '600' },
  views: { marginLeft: 'auto' },
  viewsText: { fontSize: 13 },
});

export default React.memo(ReactionBar);
