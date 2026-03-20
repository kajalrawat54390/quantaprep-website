// Save to Postgres
const sql = neon(process.env.DATABASE_URL);
const viewUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(result.secure_url)}`;
await sql`
  INSERT INTO drive_files (course, type, name, drive_id, view_url)
  VALUES (${course}, ${type}, ${file.originalname}, ${result.public_id}, ${viewUrl})
`;

res.status(200).json({
  success: true,
  url: viewUrl,
  fileId: result.public_id,
  fileName: file.originalname,
});