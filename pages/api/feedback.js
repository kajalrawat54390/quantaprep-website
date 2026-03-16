// pages/api/feedback.js
import sql from '../../lib/db';

export default async function handler(req, res) {
  // Submit feedback
  if (req.method === 'POST') {
    const { name, role, course, rating, message } = req.body;
    if (!name || !rating || !message) {
      return res.json({ success: false, message: 'All fields required.' });
    }
    await sql`
      INSERT INTO feedback (name, role, course, rating, comment, status)
      VALUES (${name}, ${role}, ${course}, ${rating}, ${message}, 'pending')
    `;
    return res.json({ success: true });
  }

  // Get approved feedback (public)
  if (req.method === 'GET') {
    const rows = await sql`
      SELECT * FROM feedback 
      WHERE status = 'approved'
      ORDER BY created_at DESC
    `;
    return res.json(rows);
  }
}