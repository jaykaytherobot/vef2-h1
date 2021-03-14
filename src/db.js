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

/* eslint-disable max-len, indent */
// passa id seinna

export async function createNewSeries(serie) {
  await query(`INSERT INTO Shows(id, name, airDate, inProduction, tagline, img, description, lang, network, website)
                                        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);`,
                                        [serie.id, serie.name, serie.airDate, serie.inProduction, serie.tagline, serie.image, serie.deseriecription, serie.language, serie.network, serie.homepage]);
  serie.genres.split(',').forEach(async (genre) => {
    let genreId;
    try {
      const result = await query(`INSERT INTO Genre(name) VALUES ($1) RETURNING id;`, [genre]);
      genreId = result.rows[0].id;
    } catch (error) {
      const result = await query(`SELECT id FROM Genre WHERE name = $1`, [genre]);
      genreId = result.rows[0].id;
    } finally {
      await query(`INSERT INTO ShowToGenre(showID, genreID) VALUES ($1, $2);`, [serie.id, genreId]);
    }
  });
}