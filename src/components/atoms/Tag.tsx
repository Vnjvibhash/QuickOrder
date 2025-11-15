import React from 'react';
import { Text, StyleSheet, View, ViewStyle } from 'react-native';

type TagProps = {
  children: string;
  style?: ViewStyle;
};

const Tag: React.FC<TagProps> = ({ children, style }) => {
  return (
    <View style={[styles.container, style]} accessible accessibilityRole="text" accessibilityLabel={`tag ${children}`}>
      <Text style={styles.text}>#{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(11,99,229,0.08)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginRight: 8,
  },
  text: {
    color: '#0B63E5',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default React.memo(Tag);
