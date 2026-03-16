// pages/api/enquiries.js
import sql from '../../lib/db';
import { getSession } from '../../lib/session';

export default async function handler(req, res) {
  // Submit enquiry (public)
  if (req.method === 'POST') {
    const { name, phone } = req.body;
    if (!name || !phone) {
      return res.json({ success: false, message: 'Name and phone required.' });
    }
    await sql`
      INSERT INTO enquiries (name, phone, status)
      VALUES (${name}, ${phone}, 'new')
    `;
    return res.json({ success: true });
  }

  // Get all enquiries (admin only)
  if (req.method === 'GET') {
    const session = await getSession(req, res);
    if (!session.admin_auth)
      return res.status(401).json({ error: 'Unauthorized' });

    const rows = await sql`
      SELECT * FROM enquiries ORDER BY created_at DESC
    `;
    return res.json(rows);
  }

  // Delete enquiry (admin only)
  if (req.method === 'DELETE') {
    const session = await getSession(req, res);
    if (!session.admin_auth)
      return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.body;
    await sql`DELETE FROM enquiries WHERE id = ${id}`;
    return res.json({ success: true });
  }
}