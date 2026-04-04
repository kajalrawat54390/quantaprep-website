import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { course, type } = req.query;
  if (!course || !type) return res.status(400).json({ error: 'Missing params' });

  try {
    const rows = await sql`
      SELECT id, name, view_url, added_at, sort_order
      FROM drive_files
      WHERE course = ${course} AND type = ${type}
      ORDER BY sort_order ASC, added_at DESC
    `;
    res.json({ files: rows });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}