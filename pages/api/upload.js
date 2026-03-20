import { google } from 'googleapis';
import { Readable } from 'stream';
import multer from 'multer';

export const config = { api: { bodyParser: false } };

const upload = multer({ storage: multer.memoryStorage() });

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive'],
});

async function getOrCreateFolder(drive, parentId, name) {
  const res = await drive.files.list({
    q: `'${parentId}' in parents and name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id)',
  });
  if (res.data.files.length > 0) return res.data.files[0].id;
  const created = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    },
    fields: 'id',
  });
  return created.data.id;
}

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) =>
    fn(req, res, err => err ? reject(err) : resolve())
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  await runMiddleware(req, res, upload.single('file'));

  const file = req.file;
  const folder = req.body.folder; // e.g. "class9/notes"
  const [course, type] = (folder || '').split('/');

  if (!file || !course || !type) {
    return res.status(400).json({ error: 'Missing file or folder' });
  }

  try {
    const drive = google.drive({ version: 'v3', auth });
    const rootId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;

    // Auto-create course and type folders
    const courseFolderId = await getOrCreateFolder(drive, rootId, course);
    const typeFolderId = await getOrCreateFolder(drive, courseFolderId, type);

    // Upload file
    const response = await drive.files.create({
      requestBody: {
        name: file.originalname,
        parents: [typeFolderId],
        mimeType: 'application/pdf',
      },
      media: {
        mimeType: 'application/pdf',
        body: Readable.from(file.buffer),
      },
      fields: 'id, name, webViewLink',
    });

    // Make it publicly viewable
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: { role: 'reader', type: 'anyone' },
    });

    res.status(200).json({
      success: true,
      url: response.data.webViewLink,
      fileId: response.data.id,
      fileName: response.data.name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
}