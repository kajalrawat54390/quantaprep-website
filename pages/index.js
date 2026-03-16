// pages/index.js — replaces index.php (same design, same functions)
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMsg, setLoginMsg] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCourse, setRegCourse] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regMsg, setRegMsg] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [accessPopup, setAccessPopup] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('class9');
  const [selRating, setSelRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [fbName, setFbName] = useState('');
  const [fbRole, setFbRole] = useState('');
  const [fbCourse, setFbCourse] = useState('');
  const [fbMessage, setFbMessage] = useState('');
  const [fbSuccess, setFbSuccess] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [adminErr, setAdminErr] = useState(false);
  const [adminTab, setAdminTab] = useState('pending');
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [navOpen, setNavOpen] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);

  const ADMIN_PASSWORD = 'kajal@admin2026';
  const COURSES = [
    { id:'class9',  label:'Class 9',  base:'resources/class9/' },
    { id:'class10', label:'Class 10', base:'resources/class10/' },
    { id:'class11', label:'Class 11', base:'resources/class11/' },
    { id:'class12', label:'Class 12', base:'resources/class12/' },
    { id:'neet',    label:'NEET',     base:'resources/neet/' },
    { id:'jee',     label:'JEE',      base:'resources/jee/' },
    { id:'cuet',    label:'CUET',     base:'resources/cuet/' },
  ];
  const RES_TYPES = [
    { id:'notes',       title:'Notes',       icon:'📝', desc:'Chapter notes & summaries',       badge:'PDF / Docs',  pyq:false },
    { id:'videos',      title:'Videos',      icon:'🎬', desc:'Recorded video lectures',          badge:'Watch Now',   pyq:false },
    { id:'assignments', title:'Assignments', icon:'📋', desc:'Practice sheets & problems',       badge:'Worksheets',  pyq:false },
    { id:'tests',       title:'Tests',       icon:'🧪', desc:'Chapter & full-length mock tests', badge:'Attempt Now', pyq:false },
    { id:'pyq',         title:'PYQ',         icon:'🏆', desc:'Previous year question papers',    badge:'Year-wise',   pyq:true  },
  ];

  function getStore(key) { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch(e) { return []; } }
  function setStore(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
  function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  useEffect(() => {
    loadFromStorage();
    const saved = sessionStorage.getItem('qp_admin_session');
    if (saved === '1') setAdminAuth(true);
    // scroll reveal
    const ro = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); }), {threshold:0.12});
    document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
    const onScroll = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); ro.disconnect(); };
  }, []);

  useEffect(() => { if (adminOpen) loadFromStorage(); }, [adminOpen]);

  function loadFromStorage() {
    setPending(getStore('qp_fb_pending_v1'));
    setApproved(getStore('qp_fb_approved_v1'));
    setRejected(getStore('qp_fb_rejected_v1'));
    setEnquiries(getStore('qp_enquiries_v1'));
    setReviews(getStore('qp_fb_approved_v1'));
  }

  // Login
  async function handleLogin() {
    if (!loginEmail || !loginPassword) { setLoginMsg('⚠ Please enter your email and password.'); return; }
    setLoginLoading(true); setLoginMsg('');
    const res = await fetch('/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email: loginEmail, password: loginPassword }) });
    const data = await res.json();
    setLoginLoading(false);
    if (data.success) {
      setCurrentUser({ name: data.name || loginEmail.split('@')[0], email: loginEmail, course: data.course });
      setLoginMsg('✓ Welcome back!');
      setTimeout(() => { setModalOpen(false); setLoginMsg(''); }, 900);
    } else {
      setLoginMsg('⚠ ' + data.message);
    }
  }

  // Register
  async function handleRegister() {
    if (!regName||!regPhone||!regEmail||!regCourse||!regPassword) { setRegMsg('⚠ Please fill in all fields.'); return; }
    const digits = regPhone.replace(/\D/g,'');
    if (digits.length < 10 || digits.length > 14) { setRegMsg('⚠ Phone must be 10–14 digits.'); return; }
    if (regPassword.length < 6) { setRegMsg('⚠ Password must be at least 6 characters.'); return; }
    setRegLoading(true); setRegMsg('');
    const res = await fetch('/api/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name:regName, phone:digits, email:regEmail, course:regCourse, password:regPassword }) });
    const data = await res.json();
    setRegLoading(false);
    if (data.success) {
      setRegMsg('✓ ' + data.message);
      setRegName(''); setRegPhone(''); setRegEmail(''); setRegCourse(''); setRegPassword('');
      setTimeout(() => { setRegMsg(''); setModalTab('login'); setLoginEmail(regEmail); }, 2200);
    } else {
      setRegMsg('⚠ ' + data.message);
    }
  }

  // Logout
  function handleLogout() {
    setCurrentUser(null);
    fetch('/api/logout').catch(()=>{});
  }

  // Resource click
  function handleResourceClick(course, type) {
    if (!currentUser) { setAccessPopup({ state:'login', course, type }); return; }
    setAccessPopup({ state:'locked', course, type });
  }

  // Feedback submit
  function submitFeedback() {
    if (!fbName) { alert('Please enter your name.'); return; }
    if (!fbRole) { alert('Please select Student or Parent.'); return; }
    if (!selRating) { alert('Please select a star rating.'); return; }
    if (!fbMessage || fbMessage.length < 10) { alert('Please write at least 10 characters.'); return; }
    const p = getStore('qp_fb_pending_v1');
    p.push({ id:genId(), name:fbName, role:fbRole, course:fbCourse, rating:selRating, message:fbMessage, status:'pending', date: new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}), submittedAt:Date.now() });
    setStore('qp_fb_pending_v1', p);
    setFbName(''); setFbRole(''); setFbCourse(''); setFbMessage(''); setSelRating(0);
    setFbSuccess(true);
    setTimeout(() => setFbSuccess(false), 5000);
  }

  // Enquiry submit
  function submitEnquiry() {
    if (!enquiryName) { alert('Please enter your name.'); return; }
    const digits = enquiryPhone.replace(/\D/g,'');
    if (digits.length < 10) { alert('Please enter a valid phone number.'); return; }
    const enqs = getStore('qp_enquiries_v1');
    enqs.push({ id:genId(), name:enquiryName, phone:enquiryPhone, date:new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}), time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}), submittedAt:Date.now(), status:'new' });
    setStore('qp_enquiries_v1', enqs);
    setEnquiryName(''); setEnquiryPhone('');
    setEnquirySuccess(true);
    setTimeout(() => setEnquirySuccess(false), 5000);
  }

  // Admin
  function checkAdminPass() {
    if (adminPass === ADMIN_PASSWORD) {
      sessionStorage.setItem('qp_admin_session','1');
      setAdminAuth(true); setAdminErr(false);
      loadFromStorage();
    } else { setAdminErr(true); }
  }

  function adminAction(id, action) {
    let p = getStore('qp_fb_pending_v1');
    let a = getStore('qp_fb_approved_v1');
    let r = getStore('qp_fb_rejected_v1');
    if (action==='approve') { const idx=p.findIndex(x=>x.id===id); if(idx!==-1){const rec=p.splice(idx,1)[0];rec.status='approved';a.push(rec);} }
    else if (action==='reject') { const idx=p.findIndex(x=>x.id===id); if(idx!==-1){const rec=p.splice(idx,1)[0];rec.status='rejected';r.push(rec);} }
    else if (action==='unapprove') { const idx=a.findIndex(x=>x.id===id); if(idx!==-1){const rec=a.splice(idx,1)[0];rec.status='pending';p.push(rec);} }
    else if (action==='restore') { const idx=r.findIndex(x=>x.id===id); if(idx!==-1){const rec=r.splice(idx,1)[0];rec.status='pending';p.push(rec);} }
    else if (action==='delete-approved') { a=a.filter(x=>x.id!==id); }
    else if (action==='delete-rejected') { r=r.filter(x=>x.id!==id); }
    setStore('qp_fb_pending_v1',p); setStore('qp_fb_approved_v1',a); setStore('qp_fb_rejected_v1',r);
    setPending(p); setApproved(a); setRejected(r); setReviews(a);
  }

  function deleteEnquiry(id) {
    const e = getStore('qp_enquiries_v1').filter(x=>x.id!==id);
    setStore('qp_enquiries_v1',e); setEnquiries(e);
  }

  const avgRating = reviews.length ? (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1) : null;

  return (
    <>
      <Head>
        <title>QuantaPrep | Physics Coaching</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        :root{--navy:#0d1b3e;--blue:#1565c0;--light-blue:#e8f0fe;--accent:#00b4d8;--white:#ffffff;--off-white:#f7faff;--text:#1a1a2e;--muted:#5a6a85;--card-shadow:0 8px 32px rgba(13,27,62,0.10);}
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'DM Sans',sans-serif;background:var(--white);color:var(--text);overflow-x:hidden;}
        ::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-track{background:var(--off-white);}::-webkit-scrollbar-thumb{background:var(--blue);border-radius:3px;}
        nav{display:flex;justify-content:space-between;align-items:center;padding:0 8%;height:68px;background:var(--navy);position:sticky;top:0;z-index:1000;box-shadow:0 2px 20px rgba(0,0,0,0.2);}
        .nav-logo{font-family:'Playfair Display',serif;font-size:26px;color:var(--white);letter-spacing:1px;cursor:pointer;}
        .nav-logo span{color:var(--accent);}
        nav ul{display:flex;gap:8px;list-style:none;}
        nav ul li a{text-decoration:none;color:rgba(255,255,255,0.8);font-size:14px;font-weight:500;padding:8px 14px;border-radius:6px;transition:all 0.2s;cursor:pointer;}
        nav ul li a:hover{background:rgba(255,255,255,0.12);color:var(--white);}
        .nav-cta{background:var(--accent)!important;color:var(--navy)!important;font-weight:600!important;}
        .nav-user-pill{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:20px;padding:5px 14px 5px 8px;}
        .nav-avatar{width:28px;height:28px;background:var(--accent);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:var(--navy);}
        .nav-uname{font-size:13px;font-weight:600;color:white;max-width:110px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .nav-logout-btn{background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);color:white;border-radius:6px;padding:5px 10px;font-size:12px;font-weight:600;cursor:pointer;}
        .hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:5px;}
        .hamburger span{display:block;width:24px;height:2px;background:white;border-radius:2px;}
        .announcement{background:linear-gradient(90deg,var(--blue),var(--accent),var(--blue));background-size:200% auto;animation:gradShift 4s linear infinite;color:white;padding:9px 0;overflow:hidden;white-space:nowrap;font-size:13.5px;font-weight:500;}
        @keyframes gradShift{0%{background-position:0% center}100%{background-position:200% center}}
        .announcement-inner{display:inline-block;padding-left:100%;animation:ticker 22s linear infinite;}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-100%)}}
        .hero{background:linear-gradient(135deg,#f7faff 0%,#e8f0fe 60%,#d0e4ff 100%);padding:90px 8% 80px;display:flex;justify-content:space-between;align-items:center;gap:50px;flex-wrap:wrap;position:relative;overflow:hidden;}
        .hero::before{content:'';position:absolute;top:-80px;right:-80px;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(0,180,216,0.12) 0%,transparent 70%);pointer-events:none;}
        .hero-text{max-width:560px;animation:fadeUp 0.7s ease both;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        .hero-badge{display:inline-block;background:rgba(0,180,216,0.12);color:var(--accent);border:1px solid rgba(0,180,216,0.3);padding:5px 14px;border-radius:20px;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:20px;}
        .hero-text h2{font-family:'Playfair Display',serif;font-size:48px;color:var(--navy);line-height:1.15;}
        .hero-text h2 span{color:var(--blue);}
        .hero-text h3{margin-top:14px;font-size:20px;color:var(--blue);font-weight:500;font-style:italic;}
        .hero-text p{margin-top:18px;line-height:1.75;color:var(--muted);font-size:15.5px;}
        .hero-buttons{display:flex;gap:14px;margin-top:32px;flex-wrap:wrap;}
        .btn-primary{padding:13px 28px;background:var(--navy);color:white;border:none;border-radius:8px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;transition:all 0.25s;}
        .btn-primary:hover{background:var(--blue);transform:translateY(-2px);box-shadow:0 8px 20px rgba(21,101,192,0.3);}
        .btn-secondary{padding:13px 28px;background:transparent;color:var(--navy);border:2px solid var(--navy);border-radius:8px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;transition:all 0.25s;}
        .btn-secondary:hover{background:var(--navy);color:white;transform:translateY(-2px);}
        .hero-image-wrap{animation:fadeUp 0.7s 0.2s ease both;position:relative;}
        .hero-image-wrap img{width:320px;border-radius:24px;box-shadow:0 24px 60px rgba(13,27,62,0.18);display:block;}
        .floating-card{position:absolute;background:white;border-radius:12px;padding:10px 16px;box-shadow:0 8px 24px rgba(0,0,0,0.12);font-size:13px;font-weight:600;color:var(--navy);animation:floatAnim 3s ease-in-out infinite;white-space:nowrap;}
        .floating-card.c1{top:20px;left:-60px;}.floating-card.c2{bottom:40px;right:-50px;animation-delay:1.5s;}
        .floating-card .dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#22c55e;margin-right:6px;vertical-align:middle;}
        @keyframes floatAnim{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .section-label{display:inline-block;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-bottom:10px;}
        .section-title{font-family:'Playfair Display',serif;font-size:34px;color:var(--navy);margin-bottom:10px;}
        .section-sub{color:var(--muted);font-size:15px;margin-bottom:40px;max-width:580px;}
        .courses-marquee{padding:60px 0;background:#f5f8ff;overflow:hidden;text-align:center;}
        .courses-marquee h2{font-family:'Playfair Display',serif;font-size:30px;color:var(--navy);margin-bottom:10px;font-weight:700;}
        .courses-marquee > p{color:var(--muted);font-size:15px;margin-bottom:40px;}
        .marquee-outer{overflow:hidden;width:100%;position:relative;}
        .marquee-outer::before{content:'';position:absolute;top:0;bottom:0;left:0;width:120px;z-index:2;pointer-events:none;background:linear-gradient(to right,#f5f8ff,transparent);}
        .marquee-outer::after{content:'';position:absolute;top:0;bottom:0;right:0;width:120px;z-index:2;pointer-events:none;background:linear-gradient(to left,#f5f8ff,transparent);}
        .marquee-track{display:flex;gap:24px;width:max-content;animation:mScroll 28s linear infinite;padding:10px 0 14px;}
        .marquee-track:hover{animation-play-state:paused;}
        @keyframes mScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .course-card{min-width:240px;background:white;border-radius:16px;padding:28px 24px;box-shadow:0 6px 24px rgba(13,27,62,0.09);border-top:4px solid var(--blue);transition:transform 0.3s,box-shadow 0.3s;cursor:default;text-align:left;user-select:none;font-family:'Poppins',sans-serif;}
        .course-card:hover{transform:translateY(-6px);box-shadow:0 16px 36px rgba(13,27,62,0.15);}
        .card-icon{font-size:32px;margin-bottom:14px;}
        .course-card h3{font-size:16px;font-weight:700;color:var(--navy);margin-bottom:8px;}
        .course-card p{font-size:13px;color:var(--muted);line-height:1.6;}
        .card-tag{display:inline-block;margin-top:12px;padding:4px 12px;background:#e8f0fe;color:var(--blue);border-radius:20px;font-size:11px;font-weight:600;}
        .resources{padding:80px 8%;background:var(--white);}
        .course-tabs-wrap{display:flex;align-items:center;gap:8px;flex-wrap:wrap;border-bottom:2px solid #e8f0fe;margin-bottom:32px;}
        .course-tab-btn{padding:10px 20px;border-radius:8px 8px 0 0;border:1.5px solid transparent;border-bottom:none;background:transparent;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.2s;position:relative;top:2px;}
        .course-tab-btn.active{background:white;color:var(--navy);font-weight:700;border-color:#e8f0fe;border-bottom-color:white;}
        .resource-type-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:18px;}
        .resource-card{background:var(--off-white);border:1.5px solid #e0ecff;border-radius:16px;padding:28px 22px 24px;text-decoration:none;color:var(--navy);transition:all 0.25s;display:flex;flex-direction:column;gap:10px;position:relative;overflow:hidden;cursor:pointer;}
        .resource-card::before{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--blue),var(--accent));transform:scaleX(0);transform-origin:left;transition:transform 0.3s;}
        .resource-card:hover{background:var(--navy);color:white;border-color:var(--navy);transform:translateY(-5px);box-shadow:0 16px 36px rgba(13,27,62,0.16);}
        .resource-card:hover::before{transform:scaleX(1);}
        .rc-icon{font-size:32px;margin-bottom:4px;display:block;line-height:1;}
        .rc-title{font-size:15px;font-weight:700;font-family:'Poppins',sans-serif;display:block;}
        .rc-desc{font-size:12.5px;opacity:0.6;display:block;line-height:1.5;}
        .rc-badge{display:inline-block;margin-top:auto;padding:4px 12px;background:rgba(21,101,192,0.1);color:var(--blue);border-radius:20px;font-size:11px;font-weight:600;}
        .resource-card:hover .rc-badge{background:rgba(255,255,255,0.15);color:white;}
        .resource-card.pyq-card{border-color:#fde8d0;}
        .resource-card.pyq-card .rc-badge{background:rgba(217,119,6,0.1);color:#d97706;}
        .resource-card.pyq-card:hover{background:#d97706;border-color:#d97706;}
        .tests{padding:80px 8%;background:white;}
        .test-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:24px;}
        .test-card{padding:28px;border-radius:14px;border:1.5px solid #e0ecff;background:var(--off-white);transition:0.3s;position:relative;overflow:hidden;}
        .test-card:hover{transform:translateY(-4px);box-shadow:var(--card-shadow);}
        .test-card h3{color:var(--navy);font-size:17px;font-weight:600;margin-bottom:16px;}
        .test-card ul{padding-left:18px;color:var(--muted);line-height:2;font-size:14px;}
        .services{padding:80px 8%;background:var(--navy);color:white;}
        .services .section-title{color:white;}.services .section-label{color:var(--accent);}.services .section-sub{color:rgba(255,255,255,0.6);}
        .service-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px;}
        .service-card{background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);padding:28px;border-radius:14px;transition:0.3s;}
        .service-card:hover{background:rgba(255,255,255,0.12);transform:translateY(-4px);border-color:var(--accent);}
        .service-card .svc-icon{font-size:32px;margin-bottom:14px;}.service-card h3{color:var(--accent);margin-bottom:12px;font-size:17px;}
        .service-card ul{padding-left:18px;line-height:1.9;opacity:0.8;font-size:14px;}
        .teacher{padding:90px 8%;display:flex;align-items:center;gap:60px;flex-wrap:wrap;background:linear-gradient(135deg,#f7faff,#e8f0fe);}
        .teacher-img-wrap{position:relative;flex-shrink:0;}
        .teacher-img-wrap img{width:260px;height:310px;object-fit:cover;border-radius:20px;box-shadow:0 20px 50px rgba(13,27,62,0.16);display:block;}
        .badge-pill{position:absolute;bottom:-16px;left:50%;transform:translateX(-50%);background:var(--navy);color:white;padding:8px 20px;border-radius:20px;font-size:13px;font-weight:600;white-space:nowrap;}
        .teacher-info{max-width:580px;}
        .teacher-info h2{font-family:'Playfair Display',serif;font-size:36px;color:var(--navy);margin-bottom:6px;}
        .teacher-info .designation{color:var(--blue);font-weight:500;font-size:15px;margin-bottom:20px;}
        .teacher-info p{color:var(--muted);line-height:1.8;font-size:15px;margin-bottom:16px;}
        .teacher-tags{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px;}
        .teacher-tags span{padding:6px 16px;background:white;border:1.5px solid #d0e4ff;border-radius:20px;font-size:13px;font-weight:500;color:var(--navy);}
        .feedback{padding:80px 8%;background:white;}
        .feedback-layout{display:grid;grid-template-columns:1fr 1.1fr;gap:48px;align-items:start;}
        .feedback-form-wrap{background:var(--off-white);border:1.5px solid #e0ecff;border-radius:18px;padding:32px 28px;}
        .feedback-form-wrap h3{font-family:'Playfair Display',serif;font-size:22px;color:var(--navy);margin-bottom:6px;}
        .form-hint{font-size:13px;color:var(--muted);margin-bottom:22px;}
        .fb-form-group{margin-bottom:14px;}
        .fb-form-group label{display:block;font-size:12px;font-weight:600;color:var(--navy);margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px;}
        .fb-form-group input,.fb-form-group select,.fb-form-group textarea{width:100%;padding:10px 14px;border:1.5px solid #dce8f8;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;color:var(--text);outline:none;background:white;}
        .fb-form-group textarea{resize:vertical;min-height:90px;}
        .star-picker{display:flex;gap:6px;margin-top:2px;}
        .star-picker span{font-size:26px;cursor:pointer;transition:color 0.15s,transform 0.15s;user-select:none;}
        .btn-submit-fb{width:100%;padding:12px;background:var(--navy);color:white;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;cursor:pointer;margin-top:6px;transition:0.2s;}
        .btn-submit-fb:hover{background:var(--blue);}
        .fb-success{text-align:center;padding:14px 0 4px;color:#16a34a;font-weight:600;font-size:15px;}
        .reviews-list{display:flex;flex-direction:column;gap:16px;max-height:520px;overflow-y:auto;}
        .feedback-card{background:var(--off-white);border:1.5px solid #e0ecff;padding:20px 22px;border-radius:14px;}
        .fb-stars{color:#f59e0b;font-size:18px;margin-bottom:8px;}
        .feedback-card p{font-size:14px;color:var(--text);line-height:1.7;margin-bottom:10px;}
        .reviewer strong{font-size:14px;color:var(--navy);}
        .reviewer span{font-size:13px;color:var(--muted);margin-left:8px;}
        .fb-date{font-size:12px;color:var(--muted);margin-top:6px;}
        .visit-section{padding:80px 8%;background:var(--off-white);}
        .visit-inner{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start;}
        .vac-row{display:flex;gap:14px;margin-bottom:18px;align-items:flex-start;}
        .vac-icon{font-size:22px;flex-shrink:0;}
        .vac-row strong{display:block;font-size:14px;font-weight:700;color:var(--navy);margin-bottom:2px;}
        .vac-row p{font-size:14px;color:var(--muted);line-height:1.6;}
        .vac-row a{color:var(--blue);text-decoration:none;}
        .visit-map-wrap{height:380px;border-radius:16px;overflow:hidden;position:relative;}
        .visit-directions-btn{display:inline-block;margin-top:20px;padding:12px 24px;background:var(--navy);color:white;border-radius:8px;font-weight:600;font-size:14px;text-decoration:none;transition:0.2s;}
        .map-open-btn{position:absolute;bottom:16px;right:16px;background:white;color:var(--navy);padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;box-shadow:0 2px 12px rgba(0,0,0,0.15);}
        .cta-section{padding:80px 8%;background:linear-gradient(135deg,var(--navy),#1a3a6e);text-align:center;color:white;}
        .cta-section h2{font-family:'Playfair Display',serif;font-size:40px;margin-bottom:14px;}
        .cta-section p{color:rgba(255,255,255,0.75);font-size:16px;margin-bottom:36px;}
        .cta-form{display:flex;gap:12px;max-width:540px;margin:0 auto;flex-wrap:wrap;}
        .cta-form input{flex:1;min-width:160px;padding:14px 18px;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;}
        .cta-form button{padding:14px 28px;background:var(--accent);color:var(--navy);border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:0.2s;}
        .form-success{margin-top:18px;color:#4ade80;font-weight:600;font-size:15px;}
        footer{background:var(--navy);color:rgba(255,255,255,0.7);}
        .footer-top{display:grid;grid-template-columns:2fr 1fr 1fr 1.5fr;gap:48px;padding:60px 8% 40px;}
        .footer-brand h3{font-family:'Playfair Display',serif;font-size:24px;color:white;margin-bottom:10px;}
        .footer-links h4{color:white;font-size:14px;font-weight:600;margin-bottom:14px;}
        .footer-links ul{list-style:none;}
        .footer-links li{margin-bottom:8px;}
        .footer-links a{color:rgba(255,255,255,0.6);text-decoration:none;font-size:14px;transition:color 0.2s;}
        .footer-links a:hover{color:var(--accent);}
        .footer-bottom{border-top:1px solid rgba(255,255,255,0.1);padding:20px 8%;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;font-size:13px;}
        .footer-socials{display:flex;gap:10px;}
        .social-btn{display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;transition:0.2s;}
        .social-btn.whatsapp{background:rgba(37,211,102,0.15);color:#4ade80;}.social-btn.whatsapp:hover{background:#25d366;color:white;}
        .social-btn.instagram{background:rgba(188,24,136,0.15);color:#f472b6;}.social-btn.instagram:hover{background:linear-gradient(45deg,#f09433,#dc2743,#bc1888);color:white;}
        .admin-trigger-link{cursor:pointer;opacity:0.2;font-size:10px;transition:opacity 0.2s;}.admin-trigger-link:hover{opacity:0.6;}
        .back-top{position:fixed;bottom:28px;right:28px;width:44px;height:44px;background:var(--navy);color:white;border:none;border-radius:50%;font-size:18px;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.2);z-index:500;display:none;transition:0.2s;}
        .back-top.show{display:flex;align-items:center;justify-content:center;}
        .float-wa{position:fixed;bottom:82px;right:28px;width:52px;height:52px;background:#25d366;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(37,211,102,0.45);z-index:500;text-decoration:none;}
        .float-insta{position:fixed;bottom:144px;right:28px;width:52px;height:52px;background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:500;text-decoration:none;}
        .modal-overlay{display:none;position:fixed;inset:0;background:rgba(10,20,50,0.60);z-index:2000;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(6px);}
        .modal-overlay.open{display:flex;}
        .modal{background:white;border-radius:20px;width:100%;max-width:420px;padding:36px 32px;position:relative;box-shadow:0 32px 80px rgba(13,27,62,0.24);animation:popIn 0.32s cubic-bezier(.34,1.56,.64,1);}
        @keyframes popIn{from{opacity:0;transform:scale(0.86) translateY(22px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .modal-close{position:absolute;top:14px;right:16px;font-size:20px;cursor:pointer;background:none;border:none;color:var(--muted);}
        .modal-tabs{display:flex;gap:8px;margin-bottom:24px;border-bottom:2px solid #e8f0fe;padding-bottom:0;}
        .modal-tab{padding:10px 18px;background:none;border:none;border-bottom:2px solid transparent;margin-bottom:-2px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;color:var(--muted);cursor:pointer;transition:0.2s;}
        .modal-tab.active{color:var(--navy);border-bottom-color:var(--blue);}
        .modal h3{font-family:'Playfair Display',serif;font-size:22px;color:var(--navy);margin-bottom:4px;}
        .modal-sub{font-size:13px;color:var(--muted);margin-bottom:20px;}
        .form-group{margin-bottom:14px;}
        .form-group label{display:block;font-size:12px;font-weight:600;color:var(--navy);margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px;}
        .form-group input,.form-group select{width:100%;padding:11px 14px;border:1.5px solid #dce8f8;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:border-color 0.2s;}
        .form-group input:focus,.form-group select:focus{border-color:var(--blue);}
        .phone-hint{font-size:11px;color:var(--muted);margin-top:4px;}
        .form-msg{display:block;font-size:13px;margin-bottom:8px;min-height:18px;}
        .btn-full{width:100%;padding:13px;background:var(--navy);color:white;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:0.2s;}
        .btn-full:hover{background:var(--blue);}
        .access-popup-overlay{display:none;position:fixed;inset:0;background:rgba(10,20,50,0.60);z-index:3000;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(6px);}
        .access-popup-overlay.open{display:flex;}
        .access-popup{background:white;border-radius:22px;width:100%;max-width:420px;position:relative;overflow:hidden;animation:popIn 0.32s cubic-bezier(.34,1.56,.64,1);box-shadow:0 32px 80px rgba(13,27,62,0.24);}
        .access-popup-close{position:absolute;top:14px;right:16px;font-size:20px;cursor:pointer;background:none;border:none;color:var(--muted);}
        .ap-band{height:6px;width:100%;}.ap-band.blue{background:linear-gradient(90deg,var(--blue),var(--accent));}.ap-band.orange{background:linear-gradient(90deg,#d97706,#f59e0b);}
        .ap-body{padding:30px 30px 26px;text-align:center;}
        .ap-icon-wrap{width:68px;height:68px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;margin:0 auto 18px;}
        .ap-icon-wrap.login-style{background:#e8f0fe;}.ap-icon-wrap.locked-style{background:#fff3cd;}
        .ap-body h3{font-family:'Playfair Display',serif;font-size:22px;color:var(--navy);margin-bottom:8px;}
        .ap-body p{font-size:14px;color:var(--muted);line-height:1.7;margin-bottom:22px;}
        .ap-section-name{display:inline-block;background:#e8f0fe;color:var(--blue);padding:4px 16px;border-radius:20px;font-size:12px;font-weight:700;margin-bottom:20px;}
        .ap-btns{display:flex;flex-direction:column;gap:10px;}
        .ap-btn{width:100%;padding:13px;border:none;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s;}
        .ap-btn-primary{background:var(--navy);color:white;}.ap-btn-primary:hover{background:var(--blue);}
        .ap-btn-secondary{background:var(--off-white);color:var(--navy);border:1.5px solid #dde8f8;}.ap-btn-secondary:hover{border-color:var(--blue);color:var(--blue);}
        .ap-btn-wa{background:#25d366;color:white;display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;border-radius:10px;padding:13px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;}
        .admin-panel-overlay{display:none;position:fixed;inset:0;background:rgba(5,10,25,0.85);z-index:4000;backdrop-filter:blur(8px);}
        .admin-panel-overlay.open{display:flex;align-items:flex-start;justify-content:center;padding:30px 20px;overflow-y:auto;}
        .admin-panel{background:#0f1f45;border-radius:20px;width:100%;max-width:860px;padding:32px;color:white;box-shadow:0 40px 100px rgba(0,0,0,0.5);}
        .admin-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;}
        .admin-header h2{font-family:'Playfair Display',serif;font-size:24px;}
        .admin-header p{font-size:13px;color:rgba(255,255,255,0.5);margin-top:2px;}
        .admin-close-btn{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:white;border-radius:8px;padding:8px 16px;cursor:pointer;font-size:13px;}
        .admin-tabs{display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap;}
        .admin-tab{padding:9px 18px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:rgba(255,255,255,0.6);cursor:pointer;font-size:13px;font-weight:600;transition:0.2s;}
        .admin-tab.active{background:rgba(0,180,216,0.15);border-color:rgba(0,180,216,0.4);color:var(--accent);}
        .admin-tab-badge{display:inline-block;margin-left:6px;background:rgba(255,255,255,0.15);color:white;padding:2px 8px;border-radius:10px;font-size:11px;}
        .arc-card{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:18px 20px;margin-bottom:12px;}
        .arc-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:10px;}
        .arc-name{font-weight:700;font-size:15px;}
        .arc-meta{font-size:13px;color:rgba(255,255,255,0.55);margin-top:2px;}
        .arc-status-badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;}
        .arc-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;}
        .arc-btn{padding:8px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;background:rgba(255,255,255,0.1);color:white;transition:0.2s;display:inline-flex;align-items:center;gap:4px;}
        .arc-btn-approve{background:rgba(74,222,128,0.15);color:#4ade80;}
        .arc-btn-reject{background:rgba(248,113,113,0.15);color:#f87171;}
        .admin-login-wrap{text-align:center;padding:40px;}
        .admin-login-input{width:100%;max-width:300px;padding:12px 16px;border:1.5px solid rgba(255,255,255,0.2);border-radius:8px;background:rgba(255,255,255,0.05);color:white;font-size:15px;font-family:'DM Sans',sans-serif;outline:none;margin-bottom:12px;}
        .admin-login-btn{padding:12px 32px;background:var(--accent);color:var(--navy);border:none;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;}
        .admin-login-err{color:#f87171;font-size:13px;margin-top:8px;}
        .reveal{opacity:0;transform:translateY(24px);transition:opacity 0.55s ease,transform 0.55s ease;}
        .reveal.visible{opacity:1;transform:translateY(0);}
        @media(max-width:900px){.hero{flex-direction:column;text-align:center;}.hero-buttons{justify-content:center;}.hero-image-wrap img{width:260px;}.floating-card.c1,.floating-card.c2{display:none;}.teacher{flex-direction:column;text-align:center;}.teacher-tags{justify-content:center;}.feedback-layout{grid-template-columns:1fr;}.visit-inner{grid-template-columns:1fr;}.footer-top{grid-template-columns:1fr 1fr;gap:24px;}}
        @media(max-width:720px){nav ul{display:none;}.nav-ul-open{display:flex!important;flex-direction:column;position:absolute;top:68px;left:0;right:0;background:var(--navy);padding:16px 8%;gap:4px;z-index:999;}.hamburger{display:flex!important;}.hero-text h2{font-size:34px;}.section-title{font-size:26px;}.cta-section h2{font-size:28px;}.modal{padding:28px 22px;}.resource-type-grid{grid-template-columns:repeat(2,1fr)!important;}}
        @media(max-width:440px){.resource-type-grid{grid-template-columns:1fr!important;}}
      `}</style>

      {/* NAV */}
      <nav id="mainNav">
        <div className="nav-logo">Quanta<span>Prep</span></div>
        <div className="hamburger" onClick={() => setNavOpen(!navOpen)} style={{display:'none'}}>
          <span/><span/><span/>
        </div>
        <ul id="navLinks" className={navOpen ? 'nav-ul-open' : ''}>
          <li><a href="#hero">Home</a></li>
          <li><a href="#resources">Resources</a></li>
          <li><a href="#tests">Test Series</a></li>
          <li><a href="#faculty">Faculty</a></li>
          <li><a href="#feedback">Feedback</a></li>
          <li><a href="#visit">Visit Us</a></li>
          {!currentUser && <li><a className="nav-cta" onClick={() => { setModalOpen(true); setModalTab('login'); }} style={{cursor:'pointer'}}>Student Login</a></li>}
        </ul>
        {currentUser && (
          <div className="nav-user-pill">
            <div className="nav-avatar">{currentUser.name.charAt(0).toUpperCase()}</div>
            <span className="nav-uname">{currentUser.name.split(' ')[0]}</span>
            <button className="nav-logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </nav>

      {/* ANNOUNCEMENT */}
      <div className="announcement">
        <div className="announcement-inner">
          🔥 New Batch Starting Soon &nbsp;|&nbsp; Admissions Open for Class 9–12 &nbsp;|&nbsp; NEET &nbsp;|&nbsp; JEE &nbsp;|&nbsp; CUET &nbsp;|&nbsp; 🏫 Online &amp; Offline Batches Available &nbsp;|&nbsp; Limited Seats &nbsp;|&nbsp; 📞 Contact Us Today &nbsp;|&nbsp;
        </div>
      </div>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-text">
          <div className="hero-badge">🎯 India's Trusted Physics Coaching</div>
          <h2>Welcome to<br/><span>QuantaPrep</span></h2>
          <h3>Where Concepts Build Confidence.</h3>
          <p>Concept-driven coaching for Classes 9–12, JEE, NEET &amp; CUET aspirants. Batches available both <strong>Online &amp; Offline</strong> — learn from wherever you are or join us in person.</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => { setModalOpen(true); setModalTab('register'); }}>Enroll Now</button>
            <button className="btn-secondary" onClick={() => { setModalOpen(true); setModalTab('login'); }}>Student Login</button>
          </div>
        </div>
        <div className="hero-image-wrap">
          <img src="/kajal-hero.png" alt="Kajal Rawat – QuantaPrep Founder" onError={e => e.target.src='https://placehold.co/320x380/0d1b3e/ffffff?text=QuantaPrep'} />
          <div className="floating-card c1"><span className="dot"></span>Live Classes Active</div>
          <div className="floating-card c2">⭐ 4.9 / 5 Rating</div>
        </div>
      </section>

      {/* COURSES MARQUEE */}
      <section className="courses-marquee">
        <h2>Courses We Offer</h2>
        <p>Expert Physics coaching for every level — school, boards &amp; competitive exams.</p>
        <div className="marquee-outer">
          <div className="marquee-track">
            {[
              {icon:'🔬',title:'Class 9 – Science',desc:'Build a strong foundation in Physics.',tag:'Foundation'},
              {icon:'⚗️',title:'Class 10 – Science',desc:'CBSE board-focused coaching with PYQ practice.',tag:'CBSE Boards'},
              {icon:'⚡',title:'Class 11 – Physics',desc:'Mechanics, Thermodynamics, Waves and more.',tag:'Intermediate'},
              {icon:'🎯',title:'Class 12 – Physics',desc:'Electrostatics, Optics, Modern Physics & board prep.',tag:'CBSE Boards'},
              {icon:'🏥',title:'NEET Physics',desc:'Targeted NEET prep with chapterwise tests.',tag:'NEET'},
              {icon:'🚀',title:'JEE Mains Physics',desc:'JEE-level problem solving and mock tests.',tag:'JEE Mains'},
              {icon:'🎓',title:'CUET Physics',desc:'CUET syllabus with MCQ practice.',tag:'CUET'},
              {icon:'📝',title:'Crash Course',desc:'Last-minute intensive revision.',tag:'Short Term'},
              {icon:'🔬',title:'Class 9 – Science',desc:'Build a strong foundation in Physics.',tag:'Foundation'},
              {icon:'⚗️',title:'Class 10 – Science',desc:'CBSE board-focused coaching with PYQ practice.',tag:'CBSE Boards'},
              {icon:'⚡',title:'Class 11 – Physics',desc:'Mechanics, Thermodynamics, Waves and more.',tag:'Intermediate'},
              {icon:'🎯',title:'Class 12 – Physics',desc:'Electrostatics, Optics, Modern Physics & board prep.',tag:'CBSE Boards'},
            ].map((c,i) => (
              <div className="course-card" key={i}>
                <div className="card-icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <span className="card-tag">{c.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESOURCES */}
      <section className="resources" id="resources">
        <div className="resources-header reveal">
          <div className="section-label">Study Material &amp; PYQ Papers</div>
          <h2 className="section-title">Student Resources</h2>
          <p className="section-sub">Click any section to access your study material. Your teacher controls access to each section individually.</p>
        </div>
        <div className="course-tabs-wrap reveal">
          {COURSES.map(c => (
            <button key={c.id} className={'course-tab-btn' + (selectedCourse===c.id?' active':'')} onClick={() => setSelectedCourse(c.id)}>{c.label}</button>
          ))}
        </div>
        <div>
          {COURSES.filter(c => c.id===selectedCourse).map(course => (
            <div key={course.id} className="resource-type-grid">
              {RES_TYPES.map(type => (
                <div key={type.id} className={'resource-card' + (type.pyq?' pyq-card':'')} onClick={() => handleResourceClick(course, type)}>
                  <span className="rc-icon">{type.icon}</span>
                  <span className="rc-title">{type.title}</span>
                  <span className="rc-desc">{type.desc}</span>
                  <span className="rc-badge">{type.badge}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* TESTS */}
      <section className="tests" id="tests">
        <div className="reveal">
          <div className="section-label">Practice</div>
          <h2 className="section-title">Test Series &amp; Assignments</h2>
          <p className="section-sub">Structured practice to build speed, accuracy, and confidence.</p>
        </div>
        <div className="test-grid reveal">
          <div className="test-card"><h3>📋 Full Length Tests</h3><ul><li>Board Pattern Tests</li><li>NEET Mock Tests</li><li>JEE Mains Mock Tests</li><li>CUET Mock Tests</li></ul></div>
          <div className="test-card"><h3>📌 Chapterwise Tests</h3><ul><li>Topic-wise Tests</li><li>Concept Strengthening Tests</li><li>Numerical Intensive Practice</li></ul></div>
          <div className="test-card"><h3>📝 Assignments</h3><ul><li>Daily Practice Problems</li><li>PYQ-Based Sheets</li><li>Board-Level Assignments</li><li>Advanced Competitive Questions</li></ul></div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services" id="services">
        <div className="reveal">
          <div className="section-label">What We Offer</div>
          <h2 className="section-title">Our Services</h2>
          <p className="section-sub">Everything you need to succeed in your Physics journey.</p>
        </div>
        <div className="service-grid reveal">
          <div className="service-card"><div className="svc-icon">🎓</div><h3>Online &amp; Offline Classes</h3><ul><li>Both online &amp; offline batches available</li><li>Live interactive sessions</li><li>Doubt clearing after class</li><li>Class recordings available</li></ul></div>
          <div className="service-card"><div className="svc-icon">📚</div><h3>Study Material</h3><ul><li>Handwritten &amp; typed notes</li><li>Video lectures library</li><li>Formula sheets &amp; mind maps</li></ul></div>
          <div className="service-card"><div className="svc-icon">📊</div><h3>Progress Tracking</h3><ul><li>Monthly performance reports</li><li>Parent updates &amp; meetings</li><li>Personalised feedback</li></ul></div>
          <div className="service-card"><div className="svc-icon">🔬</div><h3>Lab &amp; Practicals</h3><ul><li>CBSE practical preparation</li><li>Virtual experiment demos</li><li>Viva prep sessions</li></ul></div>
        </div>
      </section>

      {/* TEACHER */}
      <section className="teacher" id="faculty">
        <div className="teacher-img-wrap reveal">
          <img src="/kajal.png" alt="Kajal Rawat" onError={e => e.target.src='https://placehold.co/260x310/0d1b3e/ffffff?text=Kajal+Rawat'} />
          <div className="badge-pill">⭐ Lead Educator</div>
        </div>
        <div className="teacher-info reveal">
          <div className="section-label">Our Faculty</div>
          <h2>Kajal Rawat</h2>
          <p className="designation">Founder &amp; Lead Physics Educator, QuantaPrep</p>
          <p>Kajal Rawat is a passionate and experienced Physics teacher with over 5 years of dedicated teaching experience. Her love for Physics is genuine and infectious — she believes every student has the potential to understand and enjoy the subject when guided the right way.</p>
          <p>She works closely with young minds, shaping their thinking, building their interest in Physics, and motivating them to do better every day.</p>
          <div className="teacher-tags">
            <span>🎯 JEE Specialist</span><span>🧬 NEET Expert</span><span>📋 CBSE Boards</span><span>💡 Conceptual Teaching</span>
          </div>
        </div>
      </section>

      {/* FEEDBACK */}
      <section className="feedback" id="feedback">
        <div className="reveal">
          <div className="section-label">Testimonials</div>
          <h2 className="section-title">Student &amp; Parent Feedback</h2>
          <p className="section-sub">Share your experience — your honest feedback helps others and inspires us.</p>
        </div>
        <div className="feedback-layout reveal">
          <div className="feedback-form-wrap">
            <h3>Leave Your Feedback</h3>
            <p className="form-hint">Students &amp; parents are welcome to share their experience. Your review will appear after admin approval.</p>
            <div className="fb-form-group"><label>Your Name</label><input type="text" value={fbName} onChange={e=>setFbName(e.target.value)} placeholder="e.g. Priya Sharma" maxLength={60}/></div>
            <div className="fb-form-group"><label>You Are A</label><select value={fbRole} onChange={e=>setFbRole(e.target.value)}><option value="">— Select —</option><option value="Student">Student</option><option value="Parent">Parent</option></select></div>
            <div className="fb-form-group"><label>Course / Class</label><select value={fbCourse} onChange={e=>setFbCourse(e.target.value)}><option value="">— Select Course —</option><option>Class 9 – Science</option><option>Class 10 – Science</option><option>Class 11 – Physics</option><option>Class 12 – Physics</option><option>JEE Physics</option><option>NEET Physics</option><option>CUET Physics</option><option>Crash Course</option></select></div>
            <div className="fb-form-group"><label>Rating</label>
              <div className="star-picker">
                {[1,2,3,4,5].map(v => (
                  <span key={v} style={{color:(hoverRating||selRating)>=v?'#f59e0b':'#d1d5db'}} onMouseOver={()=>setHoverRating(v)} onMouseLeave={()=>setHoverRating(0)} onClick={()=>setSelRating(v)}>★</span>
                ))}
              </div>
            </div>
            <div className="fb-form-group"><label>Your Feedback</label><textarea value={fbMessage} onChange={e=>setFbMessage(e.target.value)} placeholder="Tell us about your experience..." maxLength={400}/></div>
            <button className="btn-submit-fb" onClick={submitFeedback}>Submit Feedback ✓</button>
            {fbSuccess && <p className="fb-success">🎉 Thank you! Your review has been submitted for approval.</p>}
          </div>
          <div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'22px',color:'var(--navy)',marginBottom:'6px'}}>What People Are Saying</h3>
            <p style={{fontSize:'13px',color:'var(--muted)',marginBottom:'20px'}}>{reviews.length ? `${reviews.length} review${reviews.length>1?'s':''} · Avg rating: ${avgRating} ★` : 'No reviews yet — be the first!'}</p>
            <div className="reviews-list">
              {reviews.length === 0 && <div style={{textAlign:'center',padding:'40px',color:'var(--muted)'}}>💬 No feedback approved yet.<br/>Share your experience using the form!</div>}
              {[...reviews].reverse().map(r => (
                <div className="feedback-card" key={r.id}>
                  <div className="fb-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                  <p>{r.message}</p>
                  <div className="reviewer"><strong>{r.name}</strong><span>{r.role}{r.course ? ' · ' + r.course : ''}</span></div>
                  <div className="fb-date">{r.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VISIT */}
      <section className="visit-section" id="visit">
        <div className="visit-inner reveal">
          <div className="visit-text">
            <div className="section-label">Find Us</div>
            <h2 className="section-title">Visit Our Centre</h2>
            <p className="section-sub">Come meet us in person! Our offline batches are held at our centre in Dehradun.</p>
            <div style={{marginTop:'24px'}}>
              <div className="vac-row"><span className="vac-icon">📍</span><div><strong>Address</strong><p>209 Tea Estate, Near Max International School,<br/>Banjarawala, Dehradun, Uttarakhand</p></div></div>
              <div className="vac-row"><span className="vac-icon">📞</span><div><strong>Phone</strong><p><a href="tel:+919389409569">+91 93894 09569</a></p></div></div>
              <div className="vac-row"><span className="vac-icon">✉️</span><div><strong>Email</strong><p><a href="mailto:quantaprep@gmail.com">quantaprep@gmail.com</a></p></div></div>
              <div className="vac-row"><span className="vac-icon">🕐</span><div><strong>Batch Timings</strong><p>Morning &amp; Evening slots available<br/>Online &amp; Offline both</p></div></div>
            </div>
            <a className="visit-directions-btn" href="https://www.google.com/maps/dir/?api=1&destination=Max+International+School+Tea+Estate+Banjarawala+Dehradun+Uttarakhand" target="_blank" rel="noopener">🗺️ Get Directions on Google Maps</a>
          </div>
          <div className="visit-map-wrap">
            <iframe src="https://maps.google.com/maps?q=Max+International+School,+Tea+Estate,+Banjarawala,+Dehradun,+Uttarakhand&t=&z=16&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{border:0,borderRadius:'16px'}} allowFullScreen loading="lazy" title="QuantaPrep Location"/>
            <a className="map-open-btn" href="https://www.google.com/maps/search/Max+International+School+Tea+Estate+Banjarawala+Dehradun+Uttarakhand" target="_blank" rel="noopener">Open in Google Maps ↗</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to Start Your Journey?</h2>
        <p>Join hundreds of students who transformed their Physics preparation with QuantaPrep.</p>
        <div className="cta-form">
          <input type="text" value={enquiryName} onChange={e=>setEnquiryName(e.target.value)} placeholder="Your Name"/>
          <input type="tel" value={enquiryPhone} onChange={e=>setEnquiryPhone(e.target.value)} placeholder="Phone Number" maxLength={14}/>
          <button onClick={submitEnquiry}>Get a Callback</button>
        </div>
        {enquirySuccess && <p className="form-success">✓ We'll call you within 24 hours!</p>}
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div className="footer-brand"><h3>QuantaPrep</h3><p>Where Concepts Build Confidence. Coaching for Classes 9–12, JEE, NEET &amp; CUET.</p></div>
          <div className="footer-links"><h4>Quick Links</h4><ul><li><a href="#hero">Home</a></li><li><a href="#resources">Resources</a></li><li><a href="#tests">Test Series</a></li><li><a href="#faculty">Faculty</a></li></ul></div>
          <div className="footer-links"><h4>Courses</h4><ul><li><a href="#">Class 9 &amp; 10</a></li><li><a href="#">Class 11 &amp; 12</a></li><li><a href="#">JEE Physics</a></li><li><a href="#">NEET Physics</a></li></ul></div>
          <div className="footer-links"><h4>Contact</h4><ul><li><a href="mailto:quantaprep@gmail.com">📧 quantaprep@gmail.com</a></li><li><a href="tel:+919389409569">📞 +91 93894 09569</a></li><li><a href="https://wa.me/919389409569" target="_blank" rel="noopener">💬 WhatsApp Us</a></li><li><a href="https://www.instagram.com/quanta.prep/" target="_blank" rel="noopener">📸 @quanta.prep</a></li></ul></div>
        </div>
        <div className="footer-bottom">
          <div className="footer-socials">
            <a href="https://wa.me/919389409569" target="_blank" rel="noopener" className="social-btn whatsapp">WhatsApp</a>
            <a href="https://www.instagram.com/quanta.prep/" target="_blank" rel="noopener" className="social-btn instagram">Instagram</a>
          </div>
          <span>© 2026 QuantaPrep | Where Concepts Build Confidence.&nbsp;&nbsp;<span className="admin-trigger-link" onClick={() => setAdminOpen(true)} title="">◆</span></span>
        </div>
      </footer>

      {/* BACK TO TOP */}
      <button className={'back-top' + (showBackTop?' show':'')} onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>↑</button>

      {/* FLOAT BUTTONS */}
      <a className="float-wa" href="https://wa.me/919389409569" target="_blank" rel="noopener" title="Chat on WhatsApp">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
      <a className="float-insta" href="https://www.instagram.com/quanta.prep/" target="_blank" rel="noopener" title="Follow on Instagram">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
      </a>

      {/* ACCESS POPUP */}
      <div className={'access-popup-overlay' + (accessPopup?' open':'')} onClick={e => { if(e.target.className.includes('access-popup-overlay')) setAccessPopup(null); }}>
        {accessPopup && (
          <div className="access-popup">
            <button className="access-popup-close" onClick={() => setAccessPopup(null)}>✕</button>
            <div className={'ap-band ' + (accessPopup.state==='login'?'blue':'orange')}></div>
            <div className="ap-body">
              <div className={'ap-icon-wrap ' + (accessPopup.state==='login'?'login-style':'locked-style')}>{accessPopup.state==='login'?'🔐':'🔒'}</div>
              <span className="ap-section-name">{accessPopup.type.icon}  {accessPopup.type.title}  ·  {accessPopup.course.label}</span>
              <h3>{accessPopup.state==='login'?'Login to Access':'Access Not Granted Yet'}</h3>
              <p>{accessPopup.state==='login'?`You need to be logged in to view ${accessPopup.type.title}. Already enrolled? Login below.`:`Hi! Your teacher hasn't unlocked ${accessPopup.type.title} for ${accessPopup.course.label} yet. Message Kajal Ma'am on WhatsApp to request access.`}</p>
              <div className="ap-btns">
                {accessPopup.state==='login' ? (
                  <>
                    <button className="ap-btn ap-btn-primary" onClick={() => { setAccessPopup(null); setModalOpen(true); setModalTab('login'); }}>🔑 Login to Continue</button>
                    <div style={{fontSize:'11px',color:'var(--muted)',textAlign:'center'}}>— or —</div>
                    <button className="ap-btn ap-btn-secondary" onClick={() => { setAccessPopup(null); setModalOpen(true); setModalTab('register'); }}>✏️ Enroll Now — It's Free</button>
                  </>
                ) : (
                  <>
                    <a className="ap-btn ap-btn-wa" href={`https://wa.me/919389409569?text=${encodeURIComponent(`Hi Kajal Ma'am, I need access to ${accessPopup.type.title} for ${accessPopup.course.label}. Please unlock it for me. Thank you!`)}`} target="_blank" rel="noopener">💬 WhatsApp Kajal Ma'am</a>
                    <button className="ap-btn ap-btn-secondary" onClick={() => setAccessPopup(null)}>Close</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LOGIN/REGISTER MODAL */}
      <div className={'modal-overlay' + (modalOpen?' open':'')} onClick={e => { if(e.target.className.includes('modal-overlay')) setModalOpen(false); }}>
        <div className="modal">
          <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
          <div className="modal-tabs">
            <button className={'modal-tab' + (modalTab==='login'?' active':'')} onClick={() => setModalTab('login')}>Student Login</button>
            <button className={'modal-tab' + (modalTab==='register'?' active':'')} onClick={() => setModalTab('register')}>Enroll Now</button>
          </div>
          {modalTab==='login' && (
            <div>
              <h3>Welcome Back</h3>
              <p className="modal-sub">Login to access your resources and tests.</p>
              <div className="form-group"><label>Email Address</label><input type="email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} placeholder="your@email.com"/></div>
              <div className="form-group"><label>Password</label><input type="password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} placeholder="Enter your password" onKeyDown={e=>e.key==='Enter'&&handleLogin()}/></div>
              <span className="form-msg" style={{color:loginMsg.includes('✓')?'#16a34a':'#dc2626'}}>{loginMsg}</span>
              <button className="btn-full" onClick={handleLogin} disabled={loginLoading}>{loginLoading?'Logging in…':'Login →'}</button>
              <p style={{textAlign:'center',marginTop:'14px',fontSize:'13px',color:'var(--muted)'}}>New here? <a href="#" style={{color:'var(--blue)'}} onClick={e=>{e.preventDefault();setModalTab('register');}}>Enroll now</a></p>
            </div>
          )}
          {modalTab==='register' && (
            <div>
              <h3>Start Learning</h3>
              <p className="modal-sub">Fill in your details to create your account.</p>
              <div className="form-group"><label>Full Name</label><input type="text" value={regName} onChange={e=>setRegName(e.target.value)} placeholder="Your full name"/></div>
              <div className="form-group"><label>Mobile Number</label><input type="tel" value={regPhone} onChange={e=>setRegPhone(e.target.value.replace(/[^0-9+]/g,'').slice(0,14))} placeholder="+91 XXXXXXXXXX" maxLength={14}/><p className="phone-hint">10–14 digits, e.g. +919389409569</p></div>
              <div className="form-group"><label>Email Address</label><input type="email" value={regEmail} onChange={e=>setRegEmail(e.target.value)} placeholder="your@email.com"/></div>
              <div className="form-group"><label>Course Interested In</label>
                <select value={regCourse} onChange={e=>setRegCourse(e.target.value)}>
                  <option value="">— Select Course —</option>
                  <option>Class 9 – Science</option><option>Class 10 – Science</option>
                  <option>Class 11 – Physics</option><option>Class 12 – Physics</option>
                  <option>JEE Physics</option><option>NEET Physics</option><option>CUET Physics</option>
                </select>
              </div>
              <div className="form-group"><label>Create Password</label><input type="password" value={regPassword} onChange={e=>setRegPassword(e.target.value)} placeholder="Min. 6 characters"/></div>
              <span className="form-msg" style={{color:regMsg.includes('✓')?'#16a34a':'#dc2626'}}>{regMsg}</span>
              <button className="btn-full" onClick={handleRegister} disabled={regLoading}>{regLoading?'Submitting…':'Submit Enquiry →'}</button>
            </div>
          )}
        </div>
      </div>

      {/* ADMIN PANEL */}
      <div className={'admin-panel-overlay' + (adminOpen?' open':'')} onClick={e => { if(e.target.className.includes('admin-panel-overlay')) setAdminOpen(false); }}>
        <div className="admin-panel">
          {!adminAuth ? (
            <div className="admin-login-wrap">
              <div style={{fontSize:'44px',marginBottom:'16px'}}>🛡️</div>
              <h3 style={{color:'white',fontFamily:"'Playfair Display',serif",marginBottom:'8px'}}>Admin Access</h3>
              <p style={{color:'rgba(255,255,255,0.5)',marginBottom:'20px'}}>Enter the admin password to manage feedback reviews.</p>
              <input className="admin-login-input" type="password" value={adminPass} onChange={e=>setAdminPass(e.target.value)} placeholder="Enter password" onKeyDown={e=>e.key==='Enter'&&checkAdminPass()}/>
              <br/>
              <button className="admin-login-btn" onClick={checkAdminPass}>Unlock Panel →</button>
              {adminErr && <p className="admin-login-err">⚠ Incorrect password. Try again.</p>}
              <p style={{marginTop:'20px',fontSize:'12px',color:'rgba(255,255,255,0.25)',cursor:'pointer'}} onClick={() => setAdminOpen(false)}>✕ Cancel</p>
            </div>
          ) : (
            <div>
              <div className="admin-header">
                <div><h2>🛡️ QuantaPrep Admin</h2><p>Feedback &amp; Enquiry Management</p></div>
                <button className="admin-close-btn" onClick={() => setAdminOpen(false)}>✕ Close Panel</button>
              </div>
              <div className="admin-tabs">
                {[['pending','⏳ Pending',pending.length,''],['approved','✅ Approved',approved.length,'rgba(74,222,128,0.25)'],['rejected','❌ Rejected',rejected.length,'rgba(248,113,113,0.18)'],['enquiries','📞 Enquiries',enquiries.length,'rgba(0,180,216,0.2)']].map(([id,label,count]) => (
                  <button key={id} className={'admin-tab'+(adminTab===id?' active':'')} onClick={()=>setAdminTab(id)}>
                    {label} <span className="admin-tab-badge">{count}</span>
                  </button>
                ))}
              </div>
              {adminTab==='pending' && (
                <div>
                  <div style={{color:'rgba(255,255,255,0.5)',fontSize:'13px',marginBottom:'16px'}}>Awaiting Your Review</div>
                  {pending.length===0 && <p style={{color:'rgba(255,255,255,0.4)',textAlign:'center',padding:'32px'}}>No pending reviews.</p>}
                  {pending.map(r => (
                    <div className="arc-card" key={r.id}>
                      <div className="arc-top"><div><div className="arc-name">{r.name}</div><div className="arc-meta">{r.role}{r.course?' · '+r.course:''} · {'★'.repeat(r.rating)} · {r.date}</div></div><span className="arc-status-badge" style={{background:'rgba(251,191,36,0.2)',color:'#fbbf24'}}>⏳ Pending</span></div>
                      <p style={{fontSize:'14px',color:'rgba(255,255,255,0.75)',lineHeight:1.6}}>{r.message}</p>
                      <div className="arc-actions">
                        <button className="arc-btn arc-btn-approve" onClick={()=>adminAction(r.id,'approve')}>✅ Approve</button>
                        <button className="arc-btn arc-btn-reject" onClick={()=>adminAction(r.id,'reject')}>❌ Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {adminTab==='approved' && (
                <div>
                  <div style={{color:'rgba(255,255,255,0.5)',fontSize:'13px',marginBottom:'16px'}}>Approved Reviews (Visible to Public)</div>
                  {approved.length===0 && <p style={{color:'rgba(255,255,255,0.4)',textAlign:'center',padding:'32px'}}>No approved reviews.</p>}
                  {approved.map(r => (
                    <div className="arc-card" key={r.id}>
                      <div className="arc-top"><div><div className="arc-name">{r.name}</div><div className="arc-meta">{r.role}{r.course?' · '+r.course:''} · {'★'.repeat(r.rating)} · {r.date}</div></div><span className="arc-status-badge" style={{background:'rgba(74,222,128,0.2)',color:'#4ade80'}}>✅ Approved</span></div>
                      <p style={{fontSize:'14px',color:'rgba(255,255,255,0.75)',lineHeight:1.6}}>{r.message}</p>
                      <div className="arc-actions">
                        <button className="arc-btn" onClick={()=>adminAction(r.id,'unapprove')}>↩ Unapprove</button>
                        <button className="arc-btn arc-btn-reject" onClick={()=>adminAction(r.id,'delete-approved')}>🗑 Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {adminTab==='rejected' && (
                <div>
                  <div style={{color:'rgba(255,255,255,0.5)',fontSize:'13px',marginBottom:'16px'}}>Rejected Reviews</div>
                  {rejected.length===0 && <p style={{color:'rgba(255,255,255,0.4)',textAlign:'center',padding:'32px'}}>No rejected reviews.</p>}
                  {rejected.map(r => (
                    <div className="arc-card" key={r.id}>
                      <div className="arc-top"><div><div className="arc-name">{r.name}</div><div className="arc-meta">{r.role}{r.course?' · '+r.course:''} · {'★'.repeat(r.rating)} · {r.date}</div></div><span className="arc-status-badge" style={{background:'rgba(248,113,113,0.18)',color:'#fca5a5'}}>❌ Rejected</span></div>
                      <p style={{fontSize:'14px',color:'rgba(255,255,255,0.75)',lineHeight:1.6}}>{r.message}</p>
                      <div className="arc-actions">
                        <button className="arc-btn arc-btn-approve" onClick={()=>adminAction(r.id,'restore')}>↩ Restore</button>
                        <button className="arc-btn arc-btn-reject" onClick={()=>adminAction(r.id,'delete-rejected')}>🗑 Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {adminTab==='enquiries' && (
                <div>
                  <div style={{color:'rgba(255,255,255,0.5)',fontSize:'13px',marginBottom:'16px'}}>Callback Requests</div>
                  {enquiries.length===0 && <p style={{color:'rgba(255,255,255,0.4)',textAlign:'center',padding:'32px'}}>No enquiries yet.</p>}
                  {enquiries.map(e => (
                    <div className="arc-card" key={e.id}>
                      <div className="arc-top"><div><div className="arc-name">{e.name}</div><div className="arc-meta">{e.phone} · {e.date} {e.time}</div></div><span className="arc-status-badge" style={{background:'rgba(0,180,216,0.15)',color:'#00b4d8'}}>📥 Callback Request</span></div>
                      <div className="arc-actions">
                        <a className="arc-btn" href={`tel:${e.phone}`} style={{background:'#1565c0',color:'white',textDecoration:'none'}}>📱 Call Now</a>
                        <a className="arc-btn" href={`https://wa.me/${e.phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Hi ${e.name}, this is QuantaPrep calling back regarding your enquiry. When would be a good time to talk?`)}`} target="_blank" rel="noopener" style={{background:'#25d366',color:'white',textDecoration:'none'}}>💬 WhatsApp</a>
                        <button className="arc-btn arc-btn-reject" onClick={()=>deleteEnquiry(e.id)}>🗑 Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
