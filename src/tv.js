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
router.get('/:tvID', async (req, res) => {
  let { tvID } = req.params;
  tvID = Number(tvID);
  const data = await db.getShowByID(tvID);
  // Ef authenticated þá bæta við einkunn og stöðu
  if (!data) {
    res.status(404).json({ msg: 'Fann ekki þátt' });
  }
  // const stats = await db.getRatingStatsByID(tvID);
  res.json({ data });
});

router.patch('/:tvID', (req, res) => {
  res.json({ foo: 'bar' });
});

router.delete('/:tvID', (req, res) => {
  res.json({ foo: 'bar' });
});

// /tv/:id/season/
router.get('/:id/season', (req, res) => {
  res.json({ foo: 'bar' });
});

router.post('/:id/season', (req, res) => {
  res.json({ foo: 'bar' });
});

// /tv/:id/season/:id
router.post('/:tvID/season/:seasonID', (req, res) => {
  console.log(req.params);
  res.json({ foo: 'bar' });
});

router.delete('/:tvID/season/:seasonID', (req, res) => {
  res.json({ foo: 'bar' });
});

// /tv/:id/season/:id/episode/
router.get('/:tvID/season/:seasonID/episode', (req, res) => {
  res.json({ foo: 'bar' });
});

router.delete('/:tvID/season/:seasonID/episode', (req, res) => {
  res.json({ foo: 'bar' });
});

// /tv/:id/season/:id/episode/:id
router.get('/:tvID/season/:seasonID/episode/:episodeID', (req, res) => {
  res.json({ foo: 'bar' });
});

router.post('/:tvID/season/:seasonID/episode/:episodeID', (req, res) => {
  res.json({ foo: 'bar' });
});

export const getGenres = async (req, res) => {
  res.json({ foo: 'bar'});
}

export const postGenres = async (req, res) => {
  res.json({ foo: 'bar'});
}
