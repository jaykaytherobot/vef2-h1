import express from 'express';
import * as db from './db.js';

export const router = express.Router();

// /tv
router.get('/', async (req, res) => {
  const data = await db.getAllFromTable('shows');
  res.json({ data });
});

router.post('/', async (req, res) => {
  const {
    serieId,
    season,
    name,
    num,
    serie,
    overview
  } = req.body;

  if (!name) {
    const error = 'Name missing from body';
    return res.status(401).json({ error });
  }

  const createdEpisode = await db.createNewEpisode({ serieId, season, name, num, serie, overview });

  if (createdEpisode) {
    return res.json({ msg: 'Episode created' });
  }

  return res.json({ err: 'Error creating episode' });
});

// /tv/:id
router.get('/:serieId', async (req, res) => {
  const { serieId } = req.params;
  const data = await db.getSerieById(serieId);
  // Ef authenticated þá bæta við einkunn og stöðu
  if (!data) {
    res.status(404).json({ msg: 'Fann ekki þátt' });
  }
  res.json({ data });
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

router.post('/:id/season', (req, res) => {
  res.json({ foo: 'bar' });
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
  res.json({ foo: 'bar' });
}

export const postGenres = async (req, res) => {
  res.json({ foo: 'bar' });
}
