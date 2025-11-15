/**
 * Minimal API client using axios.
 * Keep tokens server-side in production. This is a small client for demos.
 */
import axios from 'axios';

// const API_BASE = process.env.API_URL || 'https://dummyjson.com';
const API_BASE = 'https://dummyjson.com';

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

export const fetchUsers = async () => {
  try {
    const response = await axios.get('https://reqres.in/api/users?page=2');
    console.log("🔥 API Raw Response:", response.data); // print full response
    return response.data;
  } catch (error) {
    console.error("❌ fetchUsers Error:", error);
    throw error;
  }
};

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
