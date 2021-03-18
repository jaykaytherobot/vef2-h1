import express from 'express';
import { validationResult } from 'express-validator';
import * as db from './db.js';
import { upload } from './upload.js';
import {
  createTokenForUser,
  requireAuthentication,
  requireAdminAuthentication,
} from './login.js';
import { serieRules, seasonRules } from './form-rules.js';

export const router = express.Router();

// /tv
router.get('/', async (req, res) => {
  const result = await db.getAllFromTable('Shows');
    if (result.length!==0) return res.json(result);
    else return res.status(400).json({ msg: 'Table not found' });
  });

router.post('/',
  requireAdminAuthentication,
  upload.single('image'),
  serieRules(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    req.body.image = req.file.filename; // eða path
    const createdSerie = await db.createNewSerie(req.body);
    if (createdSerie) {
      return res.json({ msg: 'Serie created' });
    }

    return res.json({ err: 'Error creating serie' });
  });

// /tv/:id
router.get('/:serieId', async (req, res) => {
  const { serieId } = req.params;
  const data = await db.getSerieById(serieId);
  // Ef authenticated þá bæta við einkunn og stöðu
  if (!data) {
    return res.status(404).json({ msg: 'Fann ekki þátt' });
  }
  return res.json({ data });
});

router.patch('/:serieId', (req, res) => {
  res.json({ foo: 'bar' });
});

router.delete('/:serieId', (req, res) => {
  res.json({ foo: 'bar' });
});

// /tv/:id/season/
router.get('/:serieId/season', async (req, res) => {
  const { serieId } = req.params;
  const data = await db.getSeasonsBySerieId(serieId);
  // Ef authenticated þá bæta við einkunn og stöðu
  if (!data) {
    res.status(404).json({ msg: 'Fann ekki þátt' });
  }
  res.json({ data });
});

router.post('/:serieId/season',
  requireAdminAuthentication,
  upload.single('poster'),
  seasonRules(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { serieId } = req.params;
    req.body.poster = req.file.filename; // eða path
    req.body.serieId = serieId;
    const createdSeason = await db.createNewSeason(req.body);
    if (createdSeason) {
      return res.json({ msg: 'Season created' });
    }

    return res.json({ err: 'Error creating season' });
  });

// /tv/:id/season/:id
router.get('/:serieId/season/:seasonNum', async (req, res) => {
  const { serieId, seasonNum } = req.params;
  const season = await db.getSeasonBySerieIdAndSeasonNum(serieId, seasonNum);
  if (!season) {
    res.status(404).json({ msg: 'Fann ekki þátt' });
  }
  const episodes = await db.getEpisodesBySerieIdAndSeasonNum(serieId, seasonNum);
  const combined = Object.assign(season, { episodes });
  res.json({ combined });
});

router.delete('/:serieId/season/:seasonNum', (req, res) => {
  res.json({ foo: 'bar' });
});

// /tv/:id/season/:id/episode/
router.post('/:serieId/season/:seasonNum/episode', (req, res) => {
  res.json({ foo: 'bar' });
});

router.delete('/:serieId/season/:seasonNum/episode', (req, res) => {
  res.json({ foo: 'bar' });
});

// /tv/:id/season/:id/episode/:id
router.get('/:serieId/season/:seasonNum/episode/:episodeNum', async (req, res) => {
  const { serieId, seasonNum, episodeNum } = req.params;
  const data = await db.getEpisodeByNo(serieId, seasonNum, episodeNum);
  if (!data) {
    res.status(404).json({ msg: 'Fann ekki þátt' });
  }
  res.json(data);
});

router.post('/:serieId/season/:seasonNum/episode/:episodeNum', (req, res) => {
  res.json({ foo: 'bar' });
});

export const getGenres = async (req, res) => {
  const {
    offset = 0,
    limit = 10,
  } = req.query;
  const genres = await db.getAllFromTable('Genres', offset, limit);
  const next = genres.length === limit ? { href: `http://localhost:3000/genres?offset=${offset+limit}&limit=${limit}` } : undefined;
  const prev = offset > 0 ? { href: `http://localhost:3000/genres?offset=${Math.max(offset-limit, 0)}&limit=${limit}` } : undefined;
  console.log(genres);
  res.json({
    offset: offset,
    limit: limit,
    genres,
    _links: {
      prev,
      self: {
        href: `localhost:3000/genres?offset=${offset}&limit=${limit}`,
      },
      next,
    },
  });
};

export const postGenres = async (req, res) => {
  const {
    name,
  } = req.body;
  const q = 'INSERT INTO Genres(name) VALUES ($1) RETURNING *;';
  const result = await db.query(q, [name]);
  if (!result) {
    res.status(400).json({ err: 'Genre er nú þegar til' });
  }
  res.json(result.rows);
};
