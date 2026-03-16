// lib/db.js — Neon PostgreSQL connection
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default sql;