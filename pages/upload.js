// pages/upload.js
import { useState } from 'react';
import Head from 'next/head';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [folder, setFolder] = useState('class9/notes');
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [error, setError] = useState('');

  async function handleUpload() {
    if (!file) { alert('Please select a file.'); return; }
    setUploading(true);
    setError('');
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&folder=${folder}`, {
        method: 'POST',
        body: file,
      });
      const data = await res.json();
      setUploadedUrl(data.url);
    } catch(e) {
      setError('Upload failed. Please try again.');
    }
    setUploading(false);
  }

  return (
    <>
      <Head><title>Upload Files — QuantaPrep</title></Head>
      <style>{`
        body{font-family:'DM Sans',sans-serif;background:#f7faff;padding:40px;}
        .card{background:white;border-radius:16px;padding:32px;max-width:600px;margin:0 auto;box-shadow:0 8px 32px rgba(13,27,62,0.10);}
        h1{color:#0d1b3e;font-size:24px;margin-bottom:24px;}
        label{display:block;font-size:12px;font-weight:600;color:#0d1b3e;margin-bottom:5px;text-transform:uppercase;}
        select,input[type=file]{width:100%;padding:10px 14px;border:1.5px solid #dce8f8;border-radius:8px;font-size:14px;margin-bottom:16px;}
        button{padding:12px 28px;background:#0d1b3e;color:white;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;}
        .url-box{margin-top:20px;padding:14px;background:#e8f0fe;border-radius:8px;word-break:break-all;font-size:13px;}
        .err{color:#dc2626;margin-top:10px;}
      `}</style>
      <div className="card">
        <h1>📁 Upload Resource Files</h1>
        <label>Select Folder</label>
        <select value={folder} onChange={e => setFolder(e.target.value)}>
          <optgroup label="Class 9"><option value="class9/notes">Class 9 — Notes</option><option value="class9/assignments">Class 9 — Assignments</option><option value="class9/pyq">Class 9 — PYQ</option></optgroup>
          <optgroup label="Class 10"><option value="class10/notes">Class 10 — Notes</option><option value="class10/assignments">Class 10 — Assignments</option><option value="class10/pyq">Class 10 — PYQ</option></optgroup>
          <optgroup label="Class 11"><option value="class11/notes">Class 11 — Notes</option><option value="class11/assignments">Class 11 — Assignments</option><option value="class11/pyq">Class 11 — PYQ</option></optgroup>
          <optgroup label="Class 12"><option value="class12/notes">Class 12 — Notes</option><option value="class12/assignments">Class 12 — Assignments</option><option value="class12/pyq">Class 12 — PYQ</option></optgroup>
          <optgroup label="Competitive"><option value="neet/notes">NEET — Notes</option><option value="neet/pyq">NEET — PYQ</option><option value="jee/notes">JEE — Notes</option><option value="jee/pyq">JEE — PYQ</option><option value="cuet/notes">CUET — Notes</option></optgroup>
        </select>
        <label>Select PDF File</label>
        <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])}/>
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : '⬆ Upload File'}
        </button>
        {error && <p className="err">{error}</p>}
        {uploadedUrl && (
          <div className="url-box">
            ✅ Uploaded! URL:<br/>
            <a href={uploadedUrl} target="_blank" rel="noopener">{uploadedUrl}</a>
          </div>
        )}
      </div>
    </>
  );
}