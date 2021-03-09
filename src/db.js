// db.js
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const {
  DATABASE_URL: connectionString,
  NODE_ENV: nodeEnv = '',
} = process.env;

console.info('process.env :>> ', process.env.DATABASE_URL);

if (!connectionString) {
  console.error('Vantar DATABASE_URL!');
  process.exit(1);
}

// Notum SSL tengingu við gagnagrunn ef við erum *ekki* í development mode, þ.e.a.s. á local vél
const ssl = nodeEnv !== 'development' ? { rejectUnauthorized: false } : false;

const pool = new pg.Pool({ connectionString, ssl });

export async function query(q, values = []) {
  const client = await pool.connect();
  let result = '';
  try {
    result = await client.query(q, values);
  } finally {
    await client.release();
  }
  return result;
}

export async function getUserByName(name) {
  const q = 'SELECT * FROM Users WHERE name = $1';
  let result = '';
  try {
    result = await query(q, name);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result;
}

export async function getUserByID(id) {
  const q = 'SELECT * FROM Users WHERE id = $1';
  let result = '';
  try {
    result = await query(q, id);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function getShowByID(id) {
  const q = 'SELECT * FROM Shows WHERE id = $1';
  let result = '';
  try {
    result = await query(q, id);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function getSeasonByID(id) {
  const q = 'SELECT * FROM Season WHERE id = $1';
  let result = '';
  try {
    result = await query(q, id);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function getEpisodeByID(id) {
  const q = 'SELECT * FROM Episodes WHERE id = $1';
  let result = '';
  try {
    result = await query(q, id);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}
