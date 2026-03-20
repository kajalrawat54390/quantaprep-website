// pages/api/videos.js
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {

  // GET — fetch videos for a course
  if (req.method === 'GET') {
    const { course } = req.query;
    if (!course) return res.status(400).json({ error: 'Missing course' });
    const rows = await sql`
      SELECT id, title, youtube_id, added_at
      FROM videos
      WHERE course = ${course}
      ORDER BY added_at DESC
    `;
    return res.json({ videos: rows });
  }

  // POST — save a video
  if (req.method === 'POST') {
    const { course, title, youtubeId } = req.body;
    if (!course || !title || !youtubeId) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    await sql`
      INSERT INTO videos (course, title, youtube_id)
      VALUES (${course}, ${title}, ${youtubeId})
    `;
    return res.json({ success: true });
  }

  // DELETE — remove a video
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing id' });
    await sql`DELETE FROM videos WHERE id = ${id}`;
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}