// lib/db.js — replaces db.php
// Set these in Vercel → Settings → Environment Variables
import mysql from 'mysql2/promise';

let connection;

export async function getDb() {
  if (connection) return connection;
  connection = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASS     || '',
    database: process.env.DB_NAME     || 'quantaprep',
  });
  return connection;
}
