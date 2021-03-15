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
  } catch (e) {
    console.info('Error occured :>>', e);
  } finally {
    await client.release();
  }
  return result;
}

export async function getAllFromTable(table) {
  const q = `SELECT * FROM ${table};`;
  let result = '';
  try {
    result = await query(q);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function getShowById(id) {
  const q = 'SELECT s.*, AVG(stu.grade) as avgRating, COUNT(stu.grade) as ratingsCount FROM Shows s, ShowToUser stu WHERE s.id = $1 AND stu.showId = $1 GROUP BY s.id;';
  let result = '';
  try {
    result = await query(q, [id]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows[0];
}

export async function getSeasonsByShowId(showId) {
  const q = 'SELECT * FROM Seasons WHERE showId = $1;';
  let result = '';
  try {
    result = await query(q, [showId]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function getSeasonByShowIdAndSeasonNum(showId, seasonNum) {
  const q = 'SELECT * FROM Seasons WHERE num = $1 and showId = $2;';
  let result = '';
  try {
    result = await query(q, [seasonNum, showId]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows[0];
}

export async function getEpisodesByShowIdAndSeasonNum(showId, seasonNum) {
  const q = 'SELECT * FROM Episodes WHERE season = $1 and showId = $2 ORDER BY num ASC;';
  let result = '';
  try {
    result = await query(q, [seasonNum, showId]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function getEpisodeById(id) {
  const q = 'SELECT * FROM Episodes WHERE id = $1;';
  let result = '';
  try {
    result = await query(q, [id]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

/* eslint-disable max-len, indent, quotes */
// passa id seinna

export async function createNewSeries(serie) {
  await query(`INSERT INTO Shows(id, name, airDate, inProduction, tagline, img, description, lang, network, website)
                                        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);`,
                                        [serie.id, serie.name, serie.airDate, serie.inProduction, serie.tagline, serie.image, serie.deseriecription, serie.language, serie.network, serie.homepage]);
  serie.genres.split(',').forEach(async (genre) => {
    let genreId;
    try {
      const result = await query(`INSERT INTO Genres(name) VALUES ($1) RETURNING id;`, [genre]);
      genreId = result.rows[0].id;
    } catch (error) {
      const result = await query(`SELECT id FROM Genres WHERE name = $1`, [genre]);
      genreId = result.rows[0].id;
    } finally {
      await query(`INSERT INTO ShowToGenre(showId, genreId) VALUES ($1, $2);`, [serie.id, genreId]);
    }
  });
}

export async function createNewSeason(season) {
  await query(`INSERT INTO Seasons(showId, name, serieName, num, airDate, overview, poster)
                              VALUES ($1,$2,$3,$4,$5,$6,$7);`,
                              [season.serieId, season.name, season.serie, season.number, season.airDate, season.overview, season.poster]);
}

export async function createNewEpisode(episode) {
  await query(`INSERT INTO Episodes(showId, season, name, num, serie, overview)
                              VALUES ($1,$2,$3,$4,$5,$6);`,
                              [episode.serieId, episode.season, episode.name, episode.number, episode.serie, episode.overview]);
}
