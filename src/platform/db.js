import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';


const dataDir = path.resolve(process.cwd(), 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
const dbPath = path.resolve(dataDir, 'issues.db');

export const db = await open({
filename: dbPath,
driver: sqlite3.Database
});


await db.exec(`
CREATE TABLE IF NOT EXISTS issues (
id INTEGER PRIMARY KEY,
repo TEXT,
title TEXT,
body TEXT,
url TEXT,
created_at TEXT
)
`);