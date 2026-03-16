// pages/api/register.js
import sql from '../../lib/db';
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
    return res.json({ success: false, message: 'Phone number must be 10–14 digits.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.json({ success: false, message: 'Invalid email address.' });
  }
  if (password.length < 4) {
    return res.json({ success: false, message: 'Password must be at least 4 characters.' });
  }

  try {
    // Check duplicate email
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;
    if (existing.length > 0) {
      return res.json({ success: false, message: 'This email is already registered. Please login.' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (name, email, phone, course, password_hash, role)
      VALUES (${name}, ${email}, ${phone}, ${course}, ${hashed}, 'student')
    `;

    return res.json({ success: true, message: 'Registration successful! You can now login.' });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: 'Registration failed. Please try again.' });
  }
}