// pages/api/upload.js
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { folder, fileName, driveLink } = req.body;
  const [course, type] = (folder || '').split('/');

  if (!folder || !fileName || !driveLink || !course || !type) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // Extract file ID from Drive link
    // Handles: https://drive.google.com/file/d/FILE_ID/view
    // Handles: https://drive.google.com/open?id=FILE_ID
    let fileId = driveLink;
    let viewUrl = driveLink;

    const match = driveLink.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const matchOpen = driveLink.match(/[?&]id=([a-zA-Z0-9_-]+)/);

    if (match) {
      fileId = match[1];
      viewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    } else if (matchOpen) {
      fileId = matchOpen[1];
      viewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    }

    const sql = neon(process.env.DATABASE_URL);
    await sql`
      INSERT INTO drive_files (course, type, name, drive_id, view_url)
      VALUES (${course}, ${type}, ${fileName}, ${fileId}, ${viewUrl})
    `;

    return res.status(200).json({ success: true, url: viewUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to save', details: err.message });
  }
}