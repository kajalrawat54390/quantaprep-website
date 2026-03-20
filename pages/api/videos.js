// pages/api/videos.js
import { kv } from '@vercel/kv'; // or use a simple JSON file / your existing DB

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { course, type } = req.query;
    const key = `videos:${course}:${type}`;
    const videos = await kv.get(key) || [];
    return res.json({ videos });
  }

  if (req.method === 'POST') {
    // Admin adds a YouTube video
    const { course, type, title, youtubeId } = req.body;
    const key = `videos:${course}:${type}`;
    const existing = await kv.get(key) || [];
    existing.push({ id: Date.now().toString(), title, youtubeId, addedAt: new Date().toISOString() });
    await kv.set(key, existing);
    return res.json({ success: true });
  }

  if (req.method === 'DELETE') {
    const { course, type, id } = req.body;
    const key = `videos:${course}:${type}`;
    const existing = await kv.get(key) || [];
    await kv.set(key, existing.filter(v => v.id !== id));
    return res.json({ success: true });
  }
}