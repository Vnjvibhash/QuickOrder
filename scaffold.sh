#!/usr/bin/env bash
set -e

echo "Creating OmniBrand scaffold..."

# top-level src
mkdir -p src/{assets/{images,icons,fonts},components/{atoms,molecules,organisms},screens,services,hooks,contexts,navigation,theme,i18n,types,utils,stores,tests}

# create README
cat > README.md <<'MD'
# OmniBrand - Project scaffold
Scaffold generated: src/ contains components, screens, services, theme, i18n, etc.
MD

# theme tokens & color palette
cat > src/theme/tokens.ts <<'TS'
/**
 * Design tokens (exported as JS/TS for easy import).
 * Keep only values here. Designers -> devs sync.
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 20,
};

export const typography = {
  h1: 28,
  h2: 22,
  h3: 18,
  body: 16,
  caption: 12,
};

export const colors = {
  primary: '#0B63E5',
  primaryVariant: '#084EB0',
  accent: '#00C48C',
  success: '#00C48C',
  error: '#E04545',
  surface: '#FFFFFF',
  surface2: '#F6F8FA',
  textPrimary: '#0F1724',
  textMuted: '#637381',
};
TS

# theme index / provider
cat > src/theme/index.tsx <<'TSX'
import React, { createContext, useContext, ReactNode } from 'react';
import { colors as baseColors, spacing as baseSpacing, typography as baseTypography, radii as baseRadii } from './tokens';

export const Theme = {
  colors: baseColors,
  spacing: baseSpacing,
  typography: baseTypography,
  radii: baseRadii,
};

const ThemeContext = createContext(Theme);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return <ThemeContext.Provider value={Theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

export default Theme;
TSX

# basic reusable button (atom)
cat > src/components/atoms/Button.tsx <<'TSX'
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme';

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
};

const Button: React.FC<Props> = ({ title, onPress, style, textStyle, accessibilityLabel }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.colors.primary }, style]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
    >
      <Text style={[styles.text, { color: '#fff' }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    fontSize: 16,
  },
});

export default React.memo(Button);
TSX

# index barrel for atoms
cat > src/components/atoms/index.ts <<'TS'
export { default as Button } from './Button';
TS

# example molecule: PostCard (skeleton)
cat > src/components/molecules/PostCard.tsx <<'TSX'
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
TSX

# navigation placeholder
cat > src/navigation/index.tsx <<'TSX'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
TSX

# simple HomeScreen wired to components + fetch example
cat > src/screens/HomeScreen.tsx <<'TSX'
import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, FlatList, Text } from 'react-native';
import PostCard from '../components/molecules/PostCard';
import { fetchPosts } from '../services/api';

const HomeScreen: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchPosts()
      .then((res) => setPosts(res || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? <Text style={styles.loading}>Loading…</Text> : null}
      <FlatList
        data={posts}
        contentContainerStyle={{ padding: 16 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard title={item.title} subtitle={item.subtitle} image={item.image ? { uri: item.image } : undefined} />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FA' },
  loading: { padding: 16 },
});

export default HomeScreen;
TSX

# services: api client (axios) + example endpoints
cat > src/services/api.ts <<'TS'
/**
 * Minimal API client using axios.
 * Keep tokens server-side in production. This is a small client for demos.
 */
import axios from 'axios';

const API_BASE = process.env.API_URL || 'https://api.example.com';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// Request interceptor to attach token if stored in local/device storage
client.interceptors.request.use(async (config) => {
  // example: const token = await SecureStore.getItemAsync('auth-token');
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchPosts = async () => {
  try {
    const resp = await client.get('/posts');
    return resp.data?.data || resp.data;
  } catch (err) {
    console.warn('fetchPosts error', err);
    return [];
  }
};

export const createPost = async (payload: any) => {
  const resp = await client.post('/posts', payload);
  return resp.data;
};

export default client;
TS

# services: upload example
cat > src/services/upload.ts <<'TS'
/**
 * Upload helper: request presigned URL from server, then upload directly to S3.
 * This keeps your tokens server-side and avoids heavy media handling on the device.
 */
import client from './api';
import axios from 'axios';

export async function getPresignedUrl(filename: string, contentType = 'video/mp4') {
  const resp = await client.post('/uploads/presign', { filename, contentType });
  return resp.data;
}

export async function uploadToPresignedUrl(url: string, file: any, contentType = 'video/mp4') {
  // file: { uri, type, name } - typical RN file object
  const body = file; // adapt as needed
  return axios.put(url, body, {
    headers: { 'Content-Type': contentType },
  });
}
TS

# hooks: useFetch (simple)
cat > src/hooks/useFetch.ts <<'TS'
import { useState, useEffect } from 'react';

export function useFetch<T = any>(fn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fn()
      .then((res) => mounted && setData(res))
      .catch((e) => mounted && setError(e))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
TS

# i18n starter files
cat > src/i18n/index.ts <<'TS'
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './locales/en.json';
import hi from './locales/hi.json';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: { en: { translation: en }, hi: { translation: hi } },
    lng: RNLocalize.getLocales()[0]?.languageCode || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
TS

mkdir -p src/i18n/locales
cat > src/i18n/locales/en.json <<'JSON'
{
  "title": "Create Post",
  "subtitle": "Add text, video, and choose platforms",
  "post": "Post",
  "schedule": "Schedule",
  "loading": "Loading…"
}
JSON

cat > src/i18n/locales/hi.json <<'JSON'
{
  "title": "पोस्ट बनाएं",
  "subtitle": "टेक्स्ट जोड़ें, वीडियो लगाएं और प्लेटफ़ॉर्म चुनें",
  "post": "पोस्ट करें",
  "schedule": "शेड्यूल",
  "loading": "लोड हो रहा है…"
}
JSON

# types & utils
cat > src/types/index.ts <<'TS'
export type Post = {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  createdAt?: string;
};
TS

cat > src/utils/format.ts <<'TS'
export const timeAgo = (iso?: string) => {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return \`\${mins}m\`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return \`\${hrs}h\`;
  const days = Math.floor(hrs / 24);
  return \`\${days}d\`;
};
TS

# app entry (index.tsx) placeholder
cat > src/App.tsx <<'TSX'
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation';
import { ThemeProvider } from './theme';
import './i18n';

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
TSX

# create .gitkeep for empty folders
touch src/stores/.gitkeep
touch src/assets/images/.gitkeep
touch src/assets/icons/.gitkeep
touch src/assets/fonts/.gitkeep
echo "Scaffold created. Open src/ and start building."
