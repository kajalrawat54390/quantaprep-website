// pages/api/feedback.js
import sql from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, role, course, rating, message } = req.body;
    if (!name || !rating || !message) {
      return res.json({ success: false, message: 'All fields required.' });
    }
    await sql`
      INSERT INTO feedback (user_id, course_id, rating, comment)
      VALUES (NULL, NULL, ${rating}, ${message})
    `;
    return res.json({ success: true });
  }

  if (req.method === 'GET') {
    const rows = await sql`
      SELECT * FROM feedback ORDER BY created_at DESC
    `;
    return res.json(rows);
  }
}