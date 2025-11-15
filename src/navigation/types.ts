import type { PostModel } from '../types';

export type RootStackParamList = {
  Home: undefined;
  PostDetail: { post: PostModel };
};
