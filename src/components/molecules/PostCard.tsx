import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

type PostCardProps = {
  title: string;
  subtitle?: string;
  image?: any;
};

const PostCard: React.FC<PostCardProps> = ({ title, subtitle, image }) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {image ? <Image source={image} style={styles.image} /> : null}
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: { fontSize: 16, fontWeight: '600' },
  subtitle: { fontSize: 14, color: '#637381' },
});

export default React.memo(PostCard);
