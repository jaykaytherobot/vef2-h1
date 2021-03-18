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

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dqjwkhuoh/image/upload/v1615736248/'

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

export async function getAllFromTable(table, offset = 0, limit = 10) {
  const q = `SELECT * FROM ${table} OFFSET ${offset} LIMIT ${limit};`;
  let result = '';
  try {
    result = await query(q);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function getSerieById(id, offset = 0, limit = 10) {
  const q = 'SELECT s.*, AVG(stu.grade) as avgRating, COUNT(stu.grade) as ratingsCount FROM Series s, SerieToUser stu WHERE s.id = $1 AND stu.serieId = $1 GROUP BY s.id OFFSET $2 LIMIT $3;';
  let result = '';
  try {
    result = await query(q, [id, offset, limit]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows[0];
}

export async function getSeasonsBySerieId(serieId, offset = 0, limit = 10) {
  const q = 'SELECT * FROM Seasons WHERE serieId = $1 OFFSET $2 LIMIT $3;';
  let result = '';
  try {
    result = await query(q, [serieId, offset, limit]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows;
}

export async function getSeasonBySerieIdAndSeasonNum(serieId, seasonNum) {
  const q = 'SELECT * FROM Seasons WHERE num = $1 and serieId = $2;';
  let result = '';
  try {
    result = await query(q, [seasonNum, serieId]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows[0];
}

export async function getEpisodesBySerieIdAndSeasonNum(serieId, seasonNum, offset = 0, limit = 10) {
  const q = 'SELECT * FROM Episodes WHERE seasonnumber = $1 and serieId = $2 OFFSET $3 LIMIT $4 ORDER BY num ASC;';
  let result = '';
  try {
    result = await query(q, [seasonNum, serieId, offset, limit]);
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

export async function getEpisodeByNo(serieId, seasonNum, episodeNum) {
  const q = 'SELECT e.*, s.id as seasonid FROM Episodes e, Seasons s WHERE e."number" = $1 AND e.seasonnumber = $2 AND e.serieId = $3 AND s.serieId = e.serieId AND s.number = $2;';
  let result = '';
  try {
    result = await query(q, [episodeNum, seasonNum, serieId]);
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return result.rows[0];
}

/* eslint-disable max-len, indent, quotes */
// passa id seinna

export async function createNewSerie(serie) {
  let s;
  if (serie.id) {
    s = await query(`INSERT INTO Series(id, name, airDate, inProduction, tagline, image, description, language, network, url)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *;`,
    [serie.id, serie.name, serie.airDate, serie.inProduction, serie.tagline, serie.image, serie.description, serie.language, serie.network, serie.homepage]);
  } else {
    s = await query(`INSERT INTO Series(name, airDate, inProduction, tagline, image, description, language, network, url)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;`,
    [serie.name, serie.airDate, serie.inProduction, serie.tagline, serie.image, serie.description, serie.language, serie.network, serie.homepage]);
  }
  if (serie.genres) {
    serie.genres.split(',').forEach(async (genre) => {
      let genreId;
      let result;
      try {
        await query(`INSERT INTO Genres(name) VALUES ($1) ON CONFLICT(name) DO NOTHING;`, [genre]);
        result = await query(`SELECT id FROM Genres WHERE name = $1;`, [genre]);
        genreId = result.rows[0].id;
        await query(`INSERT INTO SerieToGenre(serieId, genreId) VALUES ($1, $2);`, [serie.id, genreId]);
      } catch (e) {
        console.info('Error occured :>> ', e);
      }
    });
  }
  return s;
}

export async function createNewSeason(season) {
  const airDate = (season.airDate === "") ? null : season.airDate;
  let result;
  try {
    result = await query(`INSERT INTO Seasons(serieId, name, "number", airDate, overview, poster)
                              VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;`,
      [season.serieId, season.name, season.number, airDate, season.overview, season.poster]);
    return result.rows[0];
  } catch (e) {
    console.info('Error occured :>> ', e);
  }
  return null;
}

export async function createNewEpisode(episode) {
  await query(`INSERT INTO Episodes(serieId, seasonnumber, name, "number", serie, overview)
                              VALUES ($1,$2,$3,$4,$5,$6);`,
    [episode.serieId, episode.season, episode.name, episode.number, episode.serie, episode.overview]);
}

export async function createNewUser(user) {
  await query(`INSERT INTO Users(name, email, password, admin)
                              VALUES ($1,$2,$3,$4);`,
    [user.name, user.email, user.password, user.admin]);
}
