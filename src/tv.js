import express from 'express';
import * as db from './db.js';

export const router = express.Router();

// /tv
router.get('/', async (req, res) => {
  const data = await db.getAllFromTable('shows');
  res.json({ data });
});

router.post('/', (req, res) => {
  res.json({ foo: 'bar' });
});

// /tv/:id
router.get('/:showId', async (req, res) => {
  let { showId } = req.params;
  showId = Number(showId);
  const data = await db.getShowById(showId);
  // Ef authenticated þá bæta við einkunn og stöðu
  if (!data) {
    res.status(404).json({ msg: 'Fann ekki þátt' });
  }
  res.json({ data });
});

router.patch('/:showId', (req, res) => {
  res.json({ foo: 'bar' });
});

router.delete('/:showId', (req, res) => {
  res.json({ foo: 'bar' });
});

// /tv/:id/season/
router.get('/:showId/season', async (req, res) => {
  let { showId } = req.params;
  showId = Number(showId);
  const data = await db.getSeasonsByShowId(showId);
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
router.get('/:showId/season/:seasonNum', async (req, res) => {
  let { showId, seasonNum } = req.params;
  showId = Number(showId);
  seasonNum = Number(seasonNum);
  const season = await db.getSeasonByShowIdAndSeasonNum(showId, seasonNum);
  if (!season) {
    res.status(404).json({ msg: 'Fann ekki þátt' });
  }
  console.log(season);
  const episodes = await db.getEpisodesByShowIdAndSeasonNum(showId, seasonNum);
  const combined = Object.assign(season, { episodes });
  res.json({ combined });
});

router.delete('/:showId/season/:seasonId', (req, res) => {
  res.json({ foo: 'bar' });
});

// /tv/:id/season/:id/episode/
router.get('/:showId/season/:seasonId/episode', (req, res) => {
  res.json({ foo: 'bar' });
});

router.delete('/:showId/season/:seasonId/episode', (req, res) => {
  res.json({ foo: 'bar' });
});

// /tv/:id/season/:id/episode/:id
router.get('/:showId/season/:seasonId/episode/:episodeId', (req, res) => {
  res.json({ foo: 'bar' });
});

router.post('/:showId/season/:seasonId/episode/:episodeId', (req, res) => {
  res.json({ foo: 'bar' });
});

export const getGenres = async (req, res) => {
  res.json({ foo: 'bar'});
}

export const postGenres = async (req, res) => {
  res.json({ foo: 'bar'});
}
