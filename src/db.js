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

export async function getUserByName(name) {
  const q = 'SELECT * FROM Users WHERE name = $1;';
  console.log(name);
  try {
    const result = await query(q, [name]);
    console.log(result);

    if(result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Error occured :>> ', e);
    return null;
  }
  return false;
}

export async function getUserByID(id) {
  const q = 'SELECT * FROM Users WHERE id = $1;';
  try {
    const result = await query(q, [id]);
    if(result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Error occured :>> ', e);
    return null;
  }
  return false;
}

export async function getShowByID(id) {
  const q = 'SELECT s.*, AVG(stu.grade) as avgRating, COUNT(stu.grade) as ratingsCount FROM Shows s, ShowToUser stu WHERE s.id = $1 AND stu.showId = $1 GROUP BY s.id;';
  let result = '';
  try {
    result = await query(q, [id]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows[0];
}

export async function getSeasonsByShowID(showID) {
  const q = 'SELECT * FROM Seasons WHERE showID = $1;';
  let result = '';
  try {
    result = await query(q, [showID]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function getSeasonByID(showID, seasonID) {
  const q = 'SELECT * FROM Seasons WHERE id = $1 and showID = $2;';
  let result = '';
  try {
    result = await query(q, [seasonID, showID]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function getEpisodeByID(id) {
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
      await query(`INSERT INTO ShowToGenre(showID, genreID) VALUES ($1, $2);`, [serie.id, genreId]);
    }
  });
}

export async function createNewSeason(season) {
  await query(`INSERT INTO Seasons(showID, name, serieName, num, airDate, overview, poster)
                              VALUES ($1,$2,$3,$4,$5,$6,$7);`,
                              [season.serieId, season.name, season.serie, season.number, season.airDate, season.overview, season.poster]);
}

export async function createNewEpisode(episode) {
  await query(`INSERT INTO Episodes(showID, season, name, num, serie, overview)
                              VALUES ($1,$2,$3,$4,$5,$6);`,
                              [episode.serieId, episode.season, episode.name, episode.number, episode.serie, episode.overview]);
}
