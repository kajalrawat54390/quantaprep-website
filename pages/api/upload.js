// pages/api/upload.js
import { put } from '@vercel/blob';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { searchParams } = new URL(req.url, 'http://localhost');
  const filename = searchParams.get('filename');
  const folder = searchParams.get('folder') || 'general';

  const blob = await put(`${folder}/${filename}`, req, {
    access: 'public',
  });

  return res.json({ url: blob.url });
}