// pages/api/admin-login.js
import { getSession } from '../../lib/session';

const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { admin_pass } = req.body;
  if (admin_pass === ADMIN_PASS) {
    const session = await getSession(req, res);
    session.admin_auth = true;
    await session.save();
    return res.json({ success: true });
  }
  return res.json({ success: false, message: 'Incorrect admin password.' });
}
