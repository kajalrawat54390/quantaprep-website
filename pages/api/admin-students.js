// pages/api/admin-students.js
import { getDb } from '../../lib/db';
import { getSession } from '../../lib/session';

export default async function handler(req, res) {
  const session = await getSession(req, res);
  if (!session.admin_auth) return res.status(401).json({ error: 'Unauthorized' });

  const { search = '', course = '' } = req.query;
  const db = await getDb();

  let sql = 'SELECT id, name, email, phone, course, created_at FROM students';
  const params = [];
  const where = [];

  if (search) {
    where.push('(name LIKE ? OR email LIKE ? OR phone LIKE ?)');
    const like = `%${search}%`;
    params.push(like, like, like);
  }
  if (course) {
    where.push('course = ?');
    params.push(course);
  }
  if (where.length) sql += ' WHERE ' + where.join(' AND ');
  sql += ' ORDER BY created_at DESC';

  const [students] = await db.execute(sql, params);
  const [courseRows] = await db.execute('SELECT course, COUNT(*) as cnt FROM students GROUP BY course ORDER BY cnt DESC');
  const [total] = await db.execute('SELECT COUNT(*) as c FROM students');

  return res.json({ students, courses: courseRows, total: total[0].c });
}
