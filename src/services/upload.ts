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
