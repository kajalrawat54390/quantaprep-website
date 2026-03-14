// pages/dashboard.js — replaces dashboard.php
import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export async function getServerSideProps({ req, res }) {
  const { getSession } = await import('../lib/session');
  const session = await getSession(req, res);
  if (!session.logged_in) {
    return { redirect: { destination: '/', permanent: false } };
  }
  return {
    props: {
      student: {
        id:     session.student_id || 0,
        name:   session.student_name || '',
        email:  session.student_email || '',
        phone:  session.student_phone || '',
        course: session.student_course || '',
      }
    }
  };
}

export default function Dashboard({ student }) {
  const router = useRouter();
  const parts = student.name.trim().split(' ');
  const initials = (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  const idStr = '#QP' + String(student.id).padStart(4, '0');

  const courseMap = {
    'Class 9 – Science':  'resources/class9/',
    'Class 10 – Science': 'resources/class10/',
    'Class 11 – Physics': 'resources/class11/',
    'Class 12 – Physics': 'resources/class12/',
    'JEE Physics':        'resources/jee/',
    'NEET Physics':       'resources/neet/',
    'CUET Physics':       'resources/cuet/',
  };
  const base = courseMap[student.course] || 'resources/';

  return (
    <>
      <Head>
        <title>My Dashboard — QuantaPrep</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        :root{--navy:#0d1b3e;--blue:#1565c0;--accent:#00b4d8;--off:#f7faff;--muted:#5a6a85;--white:#fff;--card-shadow:0 8px 32px rgba(13,27,62,0.10);}
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'DM Sans',sans-serif;background:var(--off);color:#1a1a2e;min-height:100vh;}
        .topbar{background:var(--navy);padding:0 6%;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;box-shadow:0 2px 16px rgba(0,0,0,0.18);}
        .topbar-logo{font-family:'Playfair Display',serif;font-size:22px;color:white;letter-spacing:1px;}
        .topbar-logo span{color:var(--accent);}
        .topbar-right{display:flex;align-items:center;gap:14px;}
        .topbar-greeting{color:rgba(255,255,255,0.7);font-size:14px;}
        .topbar-greeting strong{color:white;}
        .btn-logout{padding:8px 18px;background:rgba(255,255,255,0.1);color:white;border:1px solid rgba(255,255,255,0.2);border-radius:6px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;text-decoration:none;transition:0.2s;}
        .btn-logout:hover{background:rgba(255,255,255,0.2);}
        .page{padding:40px 6%;max-width:1100px;margin:0 auto;}
        .profile-hero{background:linear-gradient(135deg,var(--navy) 0%,#1a3a6e 100%);border-radius:20px;padding:36px 40px;display:flex;align-items:center;gap:32px;margin-bottom:32px;box-shadow:0 16px 48px rgba(13,27,62,0.22);position:relative;overflow:hidden;}
        .profile-hero::before{content:'';position:absolute;top:-60px;right:-60px;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(0,180,216,0.12) 0%,transparent 70%);pointer-events:none;}
        .avatar{width:84px;height:84px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--blue));display:flex;align-items:center;justify-content:center;font-family:'Poppins',sans-serif;font-size:28px;font-weight:700;color:white;flex-shrink:0;box-shadow:0 0 0 4px rgba(0,180,216,0.3);}
        .profile-info h2{font-family:'Playfair Display',serif;font-size:28px;color:white;margin-bottom:4px;}
        .course-pill{display:inline-block;background:rgba(0,180,216,0.2);color:var(--accent);border:1px solid rgba(0,180,216,0.4);padding:4px 14px;border-radius:20px;font-size:12px;font-weight:600;letter-spacing:0.5px;margin-bottom:14px;}
        .profile-meta{display:flex;gap:24px;flex-wrap:wrap;}
        .profile-meta span{color:rgba(255,255,255,0.65);font-size:14px;display:flex;align-items:center;gap:6px;}
        .profile-meta span b{color:white;}
        .section-label{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-bottom:10px;display:block;}
        .section-title{font-family:'Playfair Display',serif;font-size:24px;color:var(--navy);margin-bottom:20px;}
        .details-card{background:white;border-radius:16px;padding:28px 32px;box-shadow:var(--card-shadow);margin-bottom:32px;}
        .detail-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;}
        .detail-item label{display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:5px;}
        .detail-item p{font-size:15px;font-weight:600;color:var(--navy);padding:10px 14px;background:var(--off);border-radius:8px;border:1.5px solid #e0ecff;}
        .resources-card{background:white;border-radius:16px;padding:28px 32px;box-shadow:var(--card-shadow);margin-bottom:32px;}
        .res-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;}
        .res-link{background:var(--off);border:1.5px solid #e0ecff;border-radius:14px;padding:22px 16px;text-decoration:none;color:var(--navy);display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;transition:all 0.25s;}
        .res-link:hover{background:var(--navy);color:white;transform:translateY(-4px);box-shadow:0 12px 28px rgba(13,27,62,0.16);}
        .res-icon{font-size:30px;line-height:1;}
        .res-name{font-family:'Poppins',sans-serif;font-size:13px;font-weight:600;}
        .res-badge{padding:3px 10px;background:rgba(21,101,192,0.1);color:var(--blue);border-radius:20px;font-size:10px;font-weight:700;}
        .res-link:hover .res-badge{background:rgba(255,255,255,0.15);color:white;}
        .id-badge{background:white;border-radius:16px;padding:20px 28px;box-shadow:var(--card-shadow);margin-bottom:32px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;}
        .id-text{font-size:13px;color:var(--muted);}
        .id-number{font-family:'Poppins',sans-serif;font-size:22px;font-weight:700;color:var(--navy);letter-spacing:2px;}
        .id-tag{background:var(--navy);color:white;padding:8px 20px;border-radius:8px;font-size:13px;font-weight:600;}
        @media(max-width:700px){.profile-hero{flex-direction:column;text-align:center;padding:28px 24px;}.profile-meta{justify-content:center;}.page{padding:24px 4%;}.details-card,.resources-card,.id-badge{padding:20px;}.topbar-greeting{display:none;}}
      `}</style>

      <div className="topbar">
        <div className="topbar-logo">Quanta<span>Prep</span></div>
        <div className="topbar-right">
          <span className="topbar-greeting">Welcome, <strong>{student.name}</strong></span>
          <a href="/api/logout" className="btn-logout">▶ Logout</a>
        </div>
      </div>

      <div className="page">
        <div className="profile-hero">
          <div className="avatar">{initials}</div>
          <div className="profile-info">
            <h2>{student.name}</h2>
            <div className="course-pill">🎯 {student.course}</div>
            <div className="profile-meta">
              <span>📧 <b>{student.email}</b></span>
              <span>📞 <b>{student.phone}</b></span>
              <span>🎫 Student ID: <b>{idStr}</b></span>
            </div>
          </div>
        </div>

        <div className="id-badge">
          <div>
            <div className="id-text">Your QuantaPrep Student ID</div>
            <div className="id-number">{idStr}</div>
          </div>
          <div className="id-tag">✅ Active Student</div>
        </div>

        <div className="details-card">
          <span className="section-label">My Profile</span>
          <h2 className="section-title">Account Details</h2>
          <div className="detail-grid">
            <div className="detail-item"><label>Full Name</label><p>{student.name}</p></div>
            <div className="detail-item"><label>Email Address</label><p>{student.email}</p></div>
            <div className="detail-item"><label>Phone Number</label><p>{student.phone}</p></div>
            <div className="detail-item"><label>Enrolled Course</label><p>🎯 {student.course}</p></div>
          </div>
        </div>

        <div className="resources-card">
          <span className="section-label">Quick Access</span>
          <h2 className="section-title">My Course Resources</h2>
          <div className="res-grid">
            <a href={`/${base}notes/`} className="res-link"><span className="res-icon">📒</span><span className="res-name">Notes</span><span className="res-badge">Study Material</span></a>
            <a href={`/${base}videos/`} className="res-link"><span className="res-icon">🎥</span><span className="res-name">Video Lectures</span><span className="res-badge">Watch & Learn</span></a>
            <a href={`/${base}tests/`} className="res-link"><span className="res-icon">📋</span><span className="res-name">Tests</span><span className="res-badge">Self-Test</span></a>
            <a href={`/${base}assignments/`} className="res-link"><span className="res-icon">✏️</span><span className="res-name">Assignments</span><span className="res-badge">Practice</span></a>
            <a href={`/${base}pyq/`} className="res-link" style={{borderColor:'#fde8d0'}}><span className="res-icon">📄</span><span className="res-name">PYQ Papers</span><span className="res-badge" style={{background:'rgba(217,119,6,0.1)',color:'#d97706'}}>PYQ</span></a>
          </div>
        </div>
      </div>
    </>
  );
}
