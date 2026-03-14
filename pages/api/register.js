// pages/api/register.js — replaces register.php
import { getDb } from '../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  const { name, phone, email, course, password } = req.body;

  if (!name || !phone || !email || !course || !password) {
    return res.json({ success: false, message: 'All fields are required.' });
  }
  if (phone.length < 10 || phone.length > 14) {
    return res.json({ success: false, message: 'Phone number must be 10–14 digits (e.g. +91XXXXXXXXXX).' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.json({ success: false, message: 'Invalid email address.' });
  }
  if (password.length < 4) {
    return res.json({ success: false, message: 'Password must be at least 4 characters.' });
  }

  try {
    const db = await getDb();

    // Check duplicate email
    const [existing] = await db.execute('SELECT id FROM students WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.json({ success: false, message: 'This email is already registered. Please login.' });
    }

    // Hash password (replaces plain-text storage)
    const hashed = await bcrypt.hash(password, 10);

    await db.execute(
      'INSERT INTO students (name, email, phone, course, password) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, course, hashed]
    );

    return res.json({ success: true, message: 'Registration successful! You can now login.' });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: 'Registration failed. Please try again.' });
  }
}
