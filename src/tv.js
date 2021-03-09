import express from 'express';

export const router = express.Router();

// /tv
router.get('/', (req, res) => {
  res.json({ foo: 'bar' });
});

router.post('/', (req, res) => {
  res.json({ foo: 'bar' });
});

// /tv/:id
router.get('/:tvId', (req, res) => {
  res.json({ foo: 'bar' });
});

router.patch('/:tvId', (req, res) => {
  res.json({ foo: 'bar' });
});

router.delete('/:tvId', (req, res) => {
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
router.post('/:tvId/season/:seasonId', (req, res) => {
  console.log(req.params);
  res.json({ foo: 'bar' });
});

router.delete('/:tvId/season/:seasonId', (req, res) => {
  res.json({ foo: 'bar' });
});

// /tv/:id/season/:id/episode/
router.get('/:tvId/season/:seasonId/episode', (req, res) => {
  res.json({ foo: 'bar' });
});

router.delete('/:tvId/season/:seasonId/episode', (req, res) => {
  res.json({ foo: 'bar' });
});

// /tv/:id/season/:id/episode/:id
router.get('/:tvId/season/:seasonId/episode/:episodeId', (req, res) => {
  res.json({ foo: 'bar' });
});

router.post('/:tvId/season/:seasonId/episode/:episodeId', (req, res) => {
  res.json({ foo: 'bar' });
});

const genres = async (req, res) => {
  res.json({ foo: 'bar'});
}
