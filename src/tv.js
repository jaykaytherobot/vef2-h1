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
router.get('/:showID', async (req, res) => {
  let { showID } = req.params;
  showID = Number(showID);
  const data = await db.getShowByID(showID);
  // Ef authenticated þá bæta við einkunn og stöðu
  if (!data) {
    res.status(404).json({ msg: 'Fann ekki þátt' });
  }
  res.json({ data });
});

router.patch('/:showID', (req, res) => {
  res.json({ foo: 'bar' });
});

router.delete('/:showID', (req, res) => {
  res.json({ foo: 'bar' });
});

// /tv/:id/season/
router.get('/:showID/season', async (req, res) => {
  let { showID } = req.params;
  showID = Number(showID);
  const data = await db.getSeasonsByShowID(showID);
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
router.get('/:showID/season/:seasonID', async (req, res) => {
  let { showID, seasonID } = req.params;
  showID = Number(showID);
  seasonID = Number(showID);
  const data = await db.getSeasonByID(showID, seasonID);
  if (!data) {
    res.status(404).json({ msg: 'Fann ekki þátt' });
  }
  res.json({ data });
});

router.delete('/:showID/season/:seasonID', async (req, res) => {
  let { showID, seasonID } = req.params;
  showID = Number(showID);
  seasonID = Number(showID);
  const data = await db.getSeasonByID(showID, seasonID);
  if (!data) {
    res.status(404).json({ msg: 'Fann ekki þátt' });
  }
  res.json({ data });
});

// /tv/:id/season/:id/episode/
router.get('/:showID/season/:seasonID/episode', (req, res) => {
  res.json({ foo: 'bar' });
});

router.delete('/:showID/season/:seasonID/episode', (req, res) => {
  res.json({ foo: 'bar' });
});

// /tv/:id/season/:id/episode/:id
router.get('/:showID/season/:seasonID/episode/:episodeID', (req, res) => {
  res.json({ foo: 'bar' });
});

router.post('/:showID/season/:seasonID/episode/:episodeID', (req, res) => {
  res.json({ foo: 'bar' });
});

export const getGenres = async (req, res) => {
  res.json({ foo: 'bar'});
}

export const postGenres = async (req, res) => {
  res.json({ foo: 'bar'});
}
