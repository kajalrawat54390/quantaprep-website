// pages/api/upload.js
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { neon } from '@neondatabase/serverless';

export const config = { api: { bodyParser: false } };

const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) =>
    fn(req, res, err => err ? reject(err) : resolve())
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  await runMiddleware(req, res, upload.single('file'));

  const file = req.file;
  const folder = req.body.folder;
  const [course, type] = (folder || '').split('/');

  if (!file || !course || !type) {
    return res.status(400).json({ error: 'Missing file or folder' });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: `quantaprep/${course}/${type}`,
          public_id: file.originalname.replace('.pdf', ''),
          format: 'pdf',
          type: 'upload',
          access_mode: 'public',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(file.buffer);
    });

    // Save to Postgres
    const sql = neon(process.env.DATABASE_URL);
    await sql`
      INSERT INTO drive_files (course, type, name, drive_id, view_url)
      VALUES (${course}, ${type}, ${file.originalname}, ${result.public_id}, ${result.secure_url})
    `;

    res.status(200).json({
      success: true,
      url: result.secure_url,
      fileId: result.public_id,
      fileName: file.originalname,
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
}