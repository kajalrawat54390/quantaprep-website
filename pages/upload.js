// pages/upload.js
import { useState } from 'react';
import Head from 'next/head';

export default function UploadPage() {
  const [tab, setTab] = useState('pdf');

  // PDF state
  const [fileName, setFileName] = useState('');
  const [driveLink, setDriveLink] = useState('');
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
  const [videoError, setVideoError] = useState('');

  async function handleSaveDriveLink() {
    if (!fileName) { alert('Please enter a file name.'); return; }
    if (!driveLink) { alert('Please paste the Google Drive link.'); return; }
    setUploading(true); setError(''); setUploadedUrl('');
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder, fileName, driveLink }),
      });
      const data = await res.json();
      if (data.url) {
        setUploadedUrl(data.url);
        setFileName('');
        setDriveLink('');
      } else {
        setError(data.error || 'Failed to save.');
      }
    } catch(e) {
      setError('Failed to save. Please try again.');
    }
    setUploading(false);
  }

  async function handleSaveVideo() {
    if (!videoTitle) { alert('Please enter a video title.'); return; }
    if (!youtubeId) { alert('Please enter a YouTube URL or video ID.'); return; }
    setVideoSaving(true); setVideoError('');

    const match = youtubeId.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const cleanId = match ? match[1] : youtubeId.trim();

    if (cleanId.length !== 11) {
      setVideoError('Invalid YouTube URL or ID. Please check and try again.');
      setVideoSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course: videoCourse,
          type: 'videos',
          title: videoTitle,
          youtubeId: cleanId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setVideoSuccess(true);
        setVideoTitle('');
        setYoutubeId('');
        setTimeout(() => setVideoSuccess(false), 4000);
      } else {
        setVideoError(data.error || 'Failed to save video.');
      }
    } catch(e) {
      setVideoError('Failed to save video. Please try again.');
    }
    setVideoSaving(false);
  }

  const folderOptions = [
    { id:'class9',  label:'Class 9' },
    { id:'class10', label:'Class 10' },
    { id:'class11', label:'Class 11' },
    { id:'class12', label:'Class 12' },
    { id:'neet',    label:'NEET' },
    { id:'jee',     label:'JEE' },
    { id:'cuet',    label:'CUET' },
  ];

  const ytMatch = youtubeId.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const previewId = ytMatch ? ytMatch[1] : (youtubeId.trim().length === 11 ? youtubeId.trim() : null);

  return (
    <>
      <Head><title>Admin Upload — QuantaPrep</title></Head>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'DM Sans',sans-serif;background:#f7faff;padding:40px 20px;min-height:100vh;}
        .card{background:white;border-radius:18px;padding:36px 32px;max-width:620px;margin:0 auto;box-shadow:0 8px 32px rgba(13,27,62,0.10);}
        .logo{font-size:22px;font-weight:800;color:#0d1b3e;margin-bottom:4px;letter-spacing:0.5px;}
        .logo span{color:#00b4d8;}
        .subtitle{font-size:13px;color:#5a6a85;margin-bottom:24px;}
        .tabs{display:flex;gap:8px;margin-bottom:28px;border-bottom:2px solid #e8f0fe;padding-bottom:0;}
        .tab{padding:10px 20px;background:none;border:none;border-bottom:3px solid transparent;margin-bottom:-2px;font-size:14px;font-weight:600;color:#5a6a85;cursor:pointer;transition:0.2s;font-family:'DM Sans',sans-serif;}
        .tab.active{color:#0d1b3e;border-bottom-color:#1565c0;}
        label{display:block;font-size:11px;font-weight:700;color:#0d1b3e;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.6px;}
        select,input[type=text]{width:100%;padding:11px 14px;border:1.5px solid #dce8f8;border-radius:8px;font-size:14px;margin-bottom:16px;font-family:'DM Sans',sans-serif;outline:none;color:#1a1a2e;transition:border-color 0.2s;}
        select:focus,input[type=text]:focus{border-color:#1565c0;}
        button.btn{width:100%;padding:13px;background:#0d1b3e;color:white;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;transition:0.2s;font-family:'DM Sans',sans-serif;}
        button.btn:hover{background:#1565c0;}
        button.btn:disabled{opacity:0.6;cursor:not-allowed;}
        .url-box{margin-top:20px;padding:16px;background:#e8f0fe;border-radius:10px;word-break:break-all;font-size:13px;color:#0d1b3e;}
        .url-box a{color:#1565c0;font-weight:600;}
        .success-msg{margin-top:14px;color:#16a34a;font-weight:600;font-size:14px;text-align:center;}
        .err-msg{margin-top:10px;color:#dc2626;font-size:13px;font-weight:500;}
        .preview-wrap{margin-bottom:16px;border-radius:10px;overflow:hidden;aspect-ratio:16/9;background:#000;}
        .preview-wrap iframe{width:100%;height:100%;border:none;}
        .hint{font-size:12px;color:#5a6a85;margin-top:-12px;margin-bottom:16px;line-height:1.6;background:#f7faff;padding:10px 14px;border-radius:8px;border-left:3px solid #1565c0;}
        .divider{border:none;border-top:1.5px solid #e8f0fe;margin:20px 0;}
        .steps{background:#f0f7ff;border-radius:10px;padding:16px;margin-bottom:20px;border:1.5px solid #dce8f8;}
        .steps p{font-size:13px;color:#0d1b3e;margin-bottom:6px;line-height:1.6;}
        .steps strong{color:#1565c0;}
      `}</style>

      <div className="card">
        <div className="logo">Quanta<span>Prep</span></div>
        <p className="subtitle">Admin Upload Panel — Add PDFs from Google Drive or YouTube videos</p>

        <div className="tabs">
          <button className={'tab' + (tab==='pdf'?' active':'')} onClick={()=>{setTab('pdf');setError('');setUploadedUrl('');}}>📄 Add PDF</button>
          <button className={'tab' + (tab==='video'?' active':'')} onClick={()=>{setTab('video');setVideoError('');}}>🎬 Add Video</button>
        </div>

        {tab === 'pdf' && (
          <div>
            <div className="steps">
              <p>📌 <strong>How to add a PDF:</strong></p>
              <p>1️⃣ Upload your PDF to <strong>Google Drive</strong></p>
              <p>2️⃣ Right click the file → <strong>Share</strong> → change to <strong>"Anyone with the link"</strong> → Copy link</p>
              <p>3️⃣ Paste the link below and click Save</p>
            </div>

            <label>Select Folder</label>
            <select value={folder} onChange={e => setFolder(e.target.value)}>
              {folderOptions.map(({id, label}) => (
                <optgroup key={id} label={label}>
                  <option value={`${id}/notes`}>{label} — Notes</option>
                  <option value={`${id}/assignments`}>{label} — Assignments</option>
                  <option value={`${id}/pyq`}>{label} — PYQ</option>
                  <option value={`${id}/tests`}>{label} — Tests</option>
                </optgroup>
              ))}
            </select>

            <label>File Name</label>
            <input
              type="text"
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              placeholder="e.g. Chapter 3 — Laws of Motion Notes"
            />

            <label>Google Drive Link</label>
            <input
              type="text"
              value={driveLink}
              onChange={e => { setDriveLink(e.target.value); setError(''); }}
              placeholder="https://drive.google.com/file/d/..."
            />
            <p className="hint">
              ⚠️ Make sure sharing is set to <strong>"Anyone with the link can view"</strong> before copying.
            </p>

            <button className="btn" onClick={handleSaveDriveLink} disabled={uploading}>
              {uploading ? '⏳ Saving...' : '💾 Save PDF Link'}
            </button>

            {error && <p className="err-msg">❌ {error}</p>}
            {uploadedUrl && (
              <div className="url-box">
                ✅ <strong>Saved successfully!</strong><br/><br/>
                <a href={uploadedUrl} target="_blank" rel="noopener">👁 View PDF ↗</a>
              </div>
            )}
          </div>
        )}

        {tab === 'video' && (
          <div>
            <div className="steps">
              <p>📌 <strong>How to add a video:</strong></p>
              <p>1️⃣ Upload video to <strong>YouTube</strong></p>
              <p>2️⃣ Set visibility to <strong>Unlisted</strong></p>
              <p>3️⃣ Copy the video link and paste below</p>
            </div>

            <label>Course</label>
            <select value={videoCourse} onChange={e => setVideoCourse(e.target.value)}>
              {folderOptions.map(({id, label}) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>

            <label>Video Title</label>
            <input
              type="text"
              value={videoTitle}
              onChange={e => setVideoTitle(e.target.value)}
              placeholder="e.g. Chapter 3 — Laws of Motion"
            />

            <label>YouTube URL or Video ID</label>
            <input
              type="text"
              value={youtubeId}
              onChange={e => { setYoutubeId(e.target.value); setVideoError(''); }}
              placeholder="https://youtu.be/xxxxxxxxxxx"
            />
            <p className="hint">
              Unlisted videos are only visible to people who have the link — perfect for students.
            </p>

            {previewId && (
              <div className="preview-wrap">
                <iframe
                  src={`https://www.youtube.com/embed/${previewId}`}
                  allowFullScreen
                  title="Preview"
                />
              </div>
            )}

            <hr className="divider"/>

            <button className="btn" onClick={handleSaveVideo} disabled={videoSaving}>
              {videoSaving ? '⏳ Saving...' : '💾 Save Video Link'}
            </button>

            {videoError && <p className="err-msg">❌ {videoError}</p>}
            {videoSuccess && <p className="success-msg">✅ Video saved successfully!</p>}
          </div>
        )}
      </div>
    </>
  );
}