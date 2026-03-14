// pages/api/login.js — replaces login.php
import { getDb } from '../../lib/db';
import { getSession } from '../../lib/session';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: 'Email and password are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.json({ success: false, message: 'Please enter a valid email address.' });
  }

  try {
    const db = await getDb();
    const [rows] = await db.execute(
      'SELECT id, name, email, phone, course, password FROM students WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.json({ success: false, message: 'No account found with this email.' });
    }

    const student = rows[0];

    // Support both bcrypt hashes and legacy plain-text passwords
    let passwordMatch = false;
    if (student.password.startsWith('$2')) {
      passwordMatch = await bcrypt.compare(password, student.password);
    } else {
      // Plain-text legacy check
      passwordMatch = (password === student.password);
    }

    if (!passwordMatch) {
      return res.json({ success: false, message: 'Incorrect password. Please try again.' });
    }

    const session = await getSession(req, res);
    session.student_id     = student.id;
    session.student_name   = student.name;
    session.student_email  = student.email;
    session.student_phone  = student.phone;
    session.student_course = student.course;
    session.logged_in      = true;
    await session.save();

    return res.json({ success: true, message: 'Login successful!', redirect: '/dashboard' });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: 'Login failed. Please try again.' });
  }
}
