// lib/session.js
import { getIronSession } from 'iron-session';

export const sessionOptions = {
  password: process.env.SESSION_SECRET || 'quantaprep-secret-key-change-this-in-production-32chars',
  cookieName: 'qp_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function getSession(req, res) {
  return getIronSession(req, res, sessionOptions);
}
