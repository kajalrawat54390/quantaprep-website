// pages/api/admin-feedback.js
import sql from '../../lib/db';
import { getSession } from '../../lib/session';

export default async function handler(req, res) {
  const session = await getSession(req, res);
  if (!session.admin_auth)
    return res.status(401).json({ error: 'Unauthorized' });

  // Get all feedback by status
  if (req.method === 'GET') {
    const { status } = req.query;
    let rows;
    if (status) {
      rows = await sql`SELECT * FROM feedback WHERE status = ${status} ORDER BY created_at DESC`;
    } else {
      rows = await sql`SELECT * FROM feedback ORDER BY created_at DESC`;
    }
    return res.json(rows);
  }

  // Update feedback status
  if (req.method === 'POST') {
    const { id, action } = req.body;
    if (action === 'approve') {
      await sql`UPDATE feedback SET status = 'approved' WHERE id = ${id}`;
    } else if (action === 'reject') {
      await sql`UPDATE feedback SET status = 'rejected' WHERE id = ${id}`;
    } else if (action === 'pending') {
      await sql`UPDATE feedback SET status = 'pending' WHERE id = ${id}`;
    } else if (action === 'delete') {
      await sql`DELETE FROM feedback WHERE id = ${id}`;
    }
    return res.json({ success: true });
  }
}