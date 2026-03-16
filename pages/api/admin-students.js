// pages/api/admin-students.js
import sql from '../../lib/db';
import { getSession } from '../../lib/session';

export default async function handler(req, res) {
  const session = await getSession(req, res);
  if (!session.admin_auth) return res.status(401).json({ error: 'Unauthorized' });

  const { search = '', course = '' } = req.query;

  let students;
  if (search && course) {
    students = await sql`
      SELECT id, name, email, phone, course, created_at FROM users
      WHERE role = 'student'
      AND (name ILIKE ${'%'+search+'%'} OR email ILIKE ${'%'+search+'%'} OR phone ILIKE ${'%'+search+'%'})
      AND course = ${course}
      ORDER BY created_at DESC
    `;
  } else if (search) {
    students = await sql`
      SELECT id, name, email, phone, course, created_at FROM users
      WHERE role = 'student'
      AND (name ILIKE ${'%'+search+'%'} OR email ILIKE ${'%'+search+'%'} OR phone ILIKE ${'%'+search+'%'})
      ORDER BY created_at DESC
    `;
  } else if (course) {
    students = await sql`
      SELECT id, name, email, phone, course, created_at FROM users
      WHERE role = 'student' AND course = ${course}
      ORDER BY created_at DESC
    `;
  } else {
    students = await sql`
      SELECT id, name, email, phone, course, created_at FROM users
      WHERE role = 'student'
      ORDER BY created_at DESC
    `;
  }

  const courseRows = await sql`
    SELECT course, COUNT(*) as cnt FROM users
    WHERE role = 'student'
    GROUP BY course ORDER BY cnt DESC
  `;

  const totalRows = await sql`
    SELECT COUNT(*) as c FROM users WHERE role = 'student'
  `;

  return res.json({
    students,
    courses: courseRows,
    total: totalRows[0].c
  });
}