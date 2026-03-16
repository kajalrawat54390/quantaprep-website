# QuantaPrep — Next.js (Vercel-Ready)

Your QuantaPrep website converted from PHP to Next.js.  
Same design, same features — now deployable on Vercel for free.

---

## 📁 Project Structure

```
quantaprep/
├── pages/
│   ├── index.js          ← Main website (replaces index.php)
│   ├── dashboard.js      ← Student dashboard (replaces dashboard.php)
│   ├── admin.js          ← Admin panel (replaces admin.php)
│   ├── _app.js
│   └── api/
│       ├── login.js       ← replaces login.php
│       ├── register.js    ← replaces register.php
│       ├── logout.js      ← replaces logout.php
│       ├── admin-login.js
│       └── admin-students.js
├── lib/
│   ├── db.js              ← replaces db.php
│   └── session.js
├── public/
│   ├── kajal.png          ← PUT YOUR IMAGE HERE
│   └── kajal-hero.png     ← PUT YOUR IMAGE HERE
├── package.json
├── next.config.js
└── README.md
```

---

## 🚀 Deploy to Vercel (Step-by-Step)

### Step 1 — Add your images
Put `kajal.png` and `kajal-hero.png` into the `public/` folder.

### Step 2 — Set up a free MySQL database
Use one of these free MySQL hosts:
- **PlanetScale** (planetscale.com) — recommended, generous free tier
- **Railway.app** (railway.app) — easy setup
- **Aiven** (aiven.io) — free MySQL

Create your database and run the `setup.sql` file from your original project.

### Step 3 — Push to GitHub
```bash
git init
git add .
git commit -m "QuantaPrep Next.js"
git remote add origin https://github.com/YOUR_USERNAME/quantaprep.git
git push -u origin main
```

### Step 4 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Click **Deploy** — Vercel auto-detects Next.js

### Step 5 — Add Environment Variables
In Vercel → Your Project → Settings → Environment Variables, add:

| Variable | Value |
|---|---|
| `DB_HOST` | your MySQL host (e.g. `aws.connect.psdb.cloud`) |
| `DB_USER` | your DB username |
| `DB_PASS` | your DB password |
| `DB_NAME` | `quantaprep` |
| `SESSION_SECRET` | any random 32+ character string |
| `ADMIN_PASS` | your chosen admin password |

### Step 6 — Redeploy
After adding env variables, click **Redeploy** in Vercel. Done! ✅

---

## 🔑 Default URLs

| Page | URL |
|---|---|
| Home | `https://your-site.vercel.app/` |
| Student Dashboard | `https://your-site.vercel.app/dashboard` |
| Admin Panel | `https://your-site.vercel.app/admin` |

---

## ⚠️ Security Notes

- Passwords are now **bcrypt hashed** (much more secure than before)
- Set a strong `ADMIN_PASS` in your environment variables
- Never commit `.env` files to GitHub
