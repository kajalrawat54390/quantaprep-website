// pages/upload.js
import { useState } from 'react';
import Head from 'next/head';

export default function UploadPage() {
  const [tab, setTab] = useState('pdf');  // 'pdf' | 'video'

  // PDF state
  const [file, setFile] = useState(null);
  const [folder, setFolder] = useState('class9/notes');
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [error, setError] = useState('');

  // Video state
  const [videoTitle, setVideoTitle] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [videoCourse, setVideoCourse] = useState('class9');
  const [videoSaving, setVideoSaving] = useState(false);
  const [videoSuccess, setVideoSuccess] = useState(false);

  async function handleUpload() {
    if (!file) { alert('Please select a file.'); return; }
    setUploading(true); setError(''); setUploadedUrl('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) setUploadedUrl(data.url);
      else setError(data.error || 'Upload failed.');
    } catch { setError('Upload failed. Please try again.'); }
    setUploading(false);
  }

  async function handleSaveVideo() {
    if (!videoTitle || !youtubeId) { alert('Please enter both title and YouTube video ID.'); return; }
    setVideoSaving(true);
    // Extract ID if full URL was pasted
    const match = youtubeId.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const cleanId = match ? match[1] : youtubeId.trim();
    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course: videoCourse, type: 'videos', title: videoTitle, youtubeId: cleanId }),
      });
      const data = await res.json();
      if (data.success) { setVideoSuccess(true); setVideoTitle(''); setYoutubeId(''); setTimeout(() => setVideoSuccess(false), 4000); }
    } catch { alert('Failed to save video.'); }
    setVideoSaving(false);
  }

  const folderOptions = [
    ['class9','Class 9'],['class10','Class 10'],['class11','Class 11'],
    ['class12','Class 12'],['neet','NEET'],['jee','JEE'],['cuet','CUET'],
  ];

  return (
    <>
      <Head><title>Upload — QuantaPrep Admin</title></Head>
      <style>{`
        body{font-family:'DM Sans',sans-serif;background:#f7faff;padding:40px;}
        .card{background:white;border-radius:16px;padding:32px;max-width:600px;margin:0 auto;box-shadow:0 8px 32px rgba(13,27,62,0.10);}
        h1{color:#0d1b3e;font-size:24px;margin-bottom:6px;}
        .tabs{display:flex;gap:8px;margin-bottom:24px;border-bottom:2px solid #e8f0fe;padding-bottom:0;}
        .tab{padding:10px 20px;background:none;border:none;border-bottom:2px solid transparent;margin-bottom:-2px;font-size:14px;font-weight:600;color:#5a6a85;cursor:pointer;}
        .tab.active{color:#0d1b3e;border-bottom-color:#1565c0;}
        label{display:block;font-size:12px;font-weight:600;color:#0d1b3e;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px;}
        select,input[type=file],input[type=text]{width:100%;padding:10px 14px;border:1.5px solid #dce8f8;border-radius:8px;font-size:14px;margin-bottom:16px;font-family:'DM Sans',sans-serif;outline:none;}
        button{padding:12px 28px;background:#0d1b3e;color:white;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;}
        .url-box{margin-top:20px;padding:14px;background:#e8f0fe;border-radius:8px;word-break:break-all;font-size:13px;}
        .success{margin-top:16px;color:#16a34a;font-weight:600;}
        .err{color:#dc2626;margin-top:10px;font-size:13px;}
        .preview{margin-top:16px;border-radius:10px;overflow:hidden;aspect-ratio:16/9;}
        .preview iframe{width:100%;height:100%;border:none;}
        .hint{font-size:12px;color:#5a6a85;margin-top:-12px;margin-bottom:16px;}
      `}</style>
      <div className="card">
        <h1>⚙️ QuantaPrep Admin Upload</h1>
        <p style={{color:'#5a6a85',fontSize:'14px',marginBottom:'20px'}}>Upload PDFs to Google Drive or add YouTube video links.</p>
        <div className="tabs">
          <button className={'tab'+(tab==='pdf'?' active':'')} onClick={()=>setTab('pdf')}>📄 PDF Upload</button>
          <button className={'tab'+(tab==='video'?' active':'')} onClick={()=>setTab('video')}>🎬 Add Video</button>
        </div>

        {tab === 'pdf' && (
          <div>
            <label>Select Folder</label>
            <select value={folder} onChange={e => setFolder(e.target.value)}>
              {folderOptions.map(([id, label]) => (
                <optgroup key={id} label={label}>
                  <option value={`${id}/notes`}>{label} — Notes</option>
                  <option value={`${id}/assignments`}>{label} — Assignments</option>
                  <option value={`${id}/pyq`}>{label} — PYQ</option>
                  <option value={`${id}/tests`}>{label} — Tests</option>
                </optgroup>
              ))}
            </select>
            <label>Select PDF File</label>
            <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} />
            <button onClick={handleUpload} disabled={uploading}>
              {uploading ? '⏳ Uploading...' : '⬆ Upload to Google Drive'}
            </button>
            {error && <p className="err">{error}</p>}
            {uploadedUrl && (
              <div className="url-box">
                ✅ Uploaded successfully!<br/>
                <a href={uploadedUrl} target="_blank" rel="noopener">{uploadedUrl}</a>
              </div>
            )}
          </div>
        )}

        {tab === 'video' && (
          <div>
            <label>Course</label>
            <select value={videoCourse} onChange={e => setVideoCourse(e.target.value)}>
              {folderOptions.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
            <label>Video Title</label>
            <input type="text" value={videoTitle} onChange={e => setVideoTitle(e.target.value)} placeholder="e.g. Chapter 3 — Laws of Motion" />
            <label>YouTube URL or Video ID</label>
            <input type="text" value={youtubeId} onChange={e => setYoutubeId(e.target.value)} placeholder="https://youtu.be/xxxxx  or  xxxxx" />
            <p className="hint">Upload as <strong>Unlisted</strong> on YouTube, then paste the link here.</p>
            {/* Live preview */}
            {youtubeId && (() => {
              const match = youtubeId.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
              const id = match ? match[1] : youtubeId.trim();
              return id.length === 11 ? (
                <div className="preview">
                  <iframe src={`https://www.youtube.com/embed/${id}`} allowFullScreen title="Preview"/>
                </div>
              ) : null;
            })()}
            <br/>
            <button onClick={handleSaveVideo} disabled={videoSaving} style={{marginTop:'16px'}}>
              {videoSaving ? '⏳ Saving...' : '💾 Save Video Link'}
            </button>
            {videoSuccess && <p className="success">✅ Video saved successfully!</p>}
          </div>
        )}
      </div>
    </>
  );
}