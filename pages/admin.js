// pages/admin.js — replaces admin.php
import Head from 'next/head';
import { useState } from 'react';

export async function getServerSideProps({ req, res }) {
  const { getSession } = await import('../lib/session');
  const session = await getSession(req, res);
  return { props: { isAuth: !!session.admin_auth } };
}

export default function Admin({ isAuth }) {
  const [authenticated, setAuthenticated] = useState(isAuth);
  const [pass, setPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [search, setSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function doLogin(e) {
    e.preventDefault();
    const res = await fetch('/api/admin-login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ admin_pass: pass }) });
    const json = await res.json();
    if (json.success) { setAuthenticated(true); fetchStudents(); }
    else setLoginError('Incorrect admin password.');
  }

  async function fetchStudents() {
    setLoading(true);
    const params = new URLSearchParams({ search, course: filterCourse });
    const res = await fetch('/api/admin-students?' + params);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  useState(() => { if (authenticated) fetchStudents(); }, []);

  function padId(id) { return '#QP' + String(id).padStart(4, '0'); }

  if (!authenticated) {
    return (
      <>
        <Head><title>Admin Login — QuantaPrep</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;600&display=swap" rel="stylesheet"/>
        </Head>
        <style>{`*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'DM Sans',sans-serif;background:#0d1b3e;display:flex;align-items:center;justify-content:center;min-height:100vh;}.gate{background:white;border-radius:18px;padding:44px 38px;width:100%;max-width:380px;box-shadow:0 24px 60px rgba(0,0,0,0.3);text-align:center;}.gate h1{font-family:'Playfair Display',serif;font-size:26px;color:#0d1b3e;margin-bottom:6px;}.gate p{font-size:14px;color:#5a6a85;margin-bottom:28px;}.gate input{width:100%;padding:12px 16px;border:1.5px solid #dce8f8;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;margin-bottom:14px;}.gate button{width:100%;padding:13px;background:#0d1b3e;color:white;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;}.err{color:#dc2626;font-size:13px;margin-bottom:10px;}`}</style>
        <div className="gate">
          <h1>Admin Access</h1>
          <p>Enter the admin password to continue.</p>
          {loginError && <p className="err">⚠ {loginError}</p>}
          <form onSubmit={doLogin}>
            <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Admin Password" required autoFocus/>
            <button type="submit">🔒 Login to Admin Panel</button>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <Head><title>Admin Panel — QuantaPrep</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet"/>
      </Head>
      <style>{`
        :root{--navy:#0d1b3e;--blue:#1565c0;--accent:#00b4d8;--off:#f7faff;--muted:#5a6a85;--white:#fff;--card-shadow:0 8px 32px rgba(13,27,62,0.10);}
        *{margin:0;padding:0;box-sizing:border-box;}body{font-family:'DM Sans',sans-serif;background:var(--off);color:#1a1a2e;min-height:100vh;}
        .topbar{background:var(--navy);padding:0 5%;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;}
        .topbar-logo{font-family:'Playfair Display',serif;font-size:22px;color:white;}.topbar-logo span{color:var(--accent);}
        .topbar-right{display:flex;align-items:center;gap:12px;}.badge-admin{background:rgba(0,180,216,0.2);color:var(--accent);border:1px solid rgba(0,180,216,0.3);padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:1px;}
        .btn-logout{padding:7px 16px;background:rgba(255,255,255,0.1);color:white;border:1px solid rgba(255,255,255,0.2);border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;text-decoration:none;}
        .page{padding:36px 5%;max-width:1200px;margin:0 auto;}
        .page-header{margin-bottom:28px;}.page-header h1{font-family:'Playfair Display',serif;font-size:30px;color:var(--navy);margin-bottom:4px;}.page-header p{color:var(--muted);font-size:14px;}
        .stats-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:18px;margin-bottom:32px;}
        .stat-card{background:white;border-radius:14px;padding:22px 24px;box-shadow:var(--card-shadow);border-left:4px solid var(--blue);}
        .stat-card:nth-child(2){border-left-color:var(--accent);}.stat-card:nth-child(3){border-left-color:#7c3aed;}
        .stat-num{font-family:'Poppins',sans-serif;font-size:32px;font-weight:700;color:var(--navy);}.stat-label{font-size:13px;color:var(--muted);margin-top:2px;}
        .course-breakdown{background:white;border-radius:14px;padding:24px 28px;box-shadow:var(--card-shadow);margin-bottom:28px;}
        .course-breakdown h3{font-family:'Playfair Display',serif;font-size:18px;color:var(--navy);margin-bottom:16px;}
        .course-bars{display:flex;flex-direction:column;gap:10px;}.course-bar-row{display:flex;align-items:center;gap:12px;}
        .course-bar-label{font-size:13px;color:var(--navy);width:200px;flex-shrink:0;font-weight:500;}
        .course-bar-track{flex:1;background:#e8f0fe;border-radius:20px;height:10px;overflow:hidden;}
        .course-bar-fill{height:100%;border-radius:20px;background:linear-gradient(90deg,var(--blue),var(--accent));}
        .course-bar-count{font-size:12px;font-weight:700;color:var(--blue);width:24px;text-align:right;flex-shrink:0;}
        .filter-bar{background:white;border-radius:14px;padding:18px 24px;box-shadow:var(--card-shadow);margin-bottom:22px;display:flex;gap:14px;flex-wrap:wrap;align-items:center;}
        .filter-bar input,.filter-bar select{padding:9px 14px;border:1.5px solid #dce8f8;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;background:white;color:#1a1a2e;}
        .filter-bar input{flex:1;min-width:200px;}
        .btn-filter{padding:9px 22px;background:var(--navy);color:white;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;}
        .btn-clear{padding:9px 16px;background:transparent;color:var(--muted);border:1.5px solid #dce8f8;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;cursor:pointer;}
        .table-wrap{background:white;border-radius:16px;box-shadow:var(--card-shadow);overflow:hidden;margin-bottom:32px;}
        .table-header{padding:20px 28px;border-bottom:1.5px solid #e8f0fe;display:flex;align-items:center;justify-content:space-between;}
        .table-header h3{font-family:'Poppins',sans-serif;font-size:16px;font-weight:600;color:var(--navy);}.count-pill{background:#e8f0fe;color:var(--blue);padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;}
        table{width:100%;border-collapse:collapse;}thead th{background:var(--navy);color:white;padding:13px 18px;text-align:left;font-size:13px;font-weight:600;font-family:'Poppins',sans-serif;}
        tbody tr{border-bottom:1px solid #f0f4ff;transition:background 0.15s;}tbody tr:hover{background:#f5f9ff;}tbody tr:last-child{border-bottom:none;}
        tbody td{padding:13px 18px;font-size:14px;color:#1a1a2e;vertical-align:middle;}
        .td-id{font-family:'Poppins',sans-serif;font-weight:700;color:var(--blue);font-size:13px;}
        .td-name{font-weight:600;}.td-email{color:var(--muted);font-size:13px;}.td-date{color:var(--muted);font-size:12px;}
        .course-tag{display:inline-block;padding:4px 12px;background:#e8f0fe;color:var(--blue);border-radius:20px;font-size:11px;font-weight:700;}
        .no-data{text-align:center;padding:48px;color:var(--muted);font-size:15px;}
      `}</style>

      <div className="topbar">
        <div className="topbar-logo">Quanta<span>Prep</span> <span style={{fontFamily:'DM Sans',fontSize:'14px',color:'rgba(255,255,255,0.5)',fontWeight:400,marginLeft:'8px'}}>Admin</span></div>
        <div className="topbar-right">
          <span className="badge-admin">🔒 ADMIN</span>
          <a href="/api/logout" className="btn-logout">Logout</a>
        </div>
      </div>

      <div className="page">
        <div className="page-header">
          <h1>Registered Students</h1>
          <p>All students who have enrolled or submitted an enquiry through QuantaPrep.</p>
        </div>

        {data && (
          <>
            <div className="stats-row">
              <div className="stat-card"><div className="stat-num">{data.total}</div><div className="stat-label">Total Students</div></div>
              <div className="stat-card"><div className="stat-num">{data.courses.length}</div><div className="stat-label">Courses Active</div></div>
              <div className="stat-card"><div className="stat-num">{data.students.length}</div><div className="stat-label">Showing Now</div></div>
            </div>

            {data.courses.length > 0 && (
              <div className="course-breakdown">
                <h3>Enrolment by Course</h3>
                <div className="course-bars">
                  {data.courses.map(c => {
                    const pct = data.total > 0 ? Math.round((c.cnt / data.total) * 100) : 0;
                    return (
                      <div className="course-bar-row" key={c.course}>
                        <span className="course-bar-label">{c.course}</span>
                        <div className="course-bar-track"><div className="course-bar-fill" style={{width:`${pct}%`}}></div></div>
                        <span className="course-bar-count">{c.cnt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        <div className="filter-bar">
          <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search by name, email or phone…"/>
          <select value={filterCourse} onChange={e=>setFilterCourse(e.target.value)}>
            <option value="">All Courses</option>
            {data?.courses.map(c => <option key={c.course} value={c.course}>{c.course}</option>)}
          </select>
          <button className="btn-filter" onClick={fetchStudents}>Filter</button>
          {(search || filterCourse) && <button className="btn-clear" onClick={() => { setSearch(''); setFilterCourse(''); setTimeout(fetchStudents, 0); }}>✕ Clear</button>}
        </div>

        <div className="table-wrap">
          <div className="table-header">
            <h3>Student Records</h3>
            <span className="count-pill">{loading ? '…' : `${data?.students.length ?? 0} student${data?.students.length !== 1 ? 's' : ''}`}</span>
          </div>
          {loading ? (
            <div className="no-data"><p>Loading…</p></div>
          ) : (
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Course</th><th>Joined</th></tr></thead>
              <tbody>
                {data?.students.length === 0 && (
                  <tr><td colSpan={6}><div className="no-data"><p>{search || filterCourse ? 'No students match your search.' : 'No students registered yet.'}</p></div></td></tr>
                )}
                {data?.students.map(row => (
                  <tr key={row.id}>
                    <td className="td-id">{padId(row.id)}</td>
                    <td className="td-name">{row.name}</td>
                    <td className="td-email">{row.email}</td>
                    <td>{row.phone}</td>
                    <td><span className="course-tag">{row.course}</span></td>
                    <td className="td-date">{new Date(row.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
