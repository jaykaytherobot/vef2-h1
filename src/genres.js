import express from 'express';
import * as db from './db.js';
import { getLinks, sanitize } from './utils.js';
import { paginationRules } from './form-rules.js';
import { requireAdminAuthentication } from './login.js';

export const router = express.Router();

router.get('/', 
paginationRules(),
async (req, res) => {
  const {
    offset = 0,
    limit = 10,
  } = req.query;
  const genres = await db.getAllFromTable('Genres', 'name', offset, limit);
  const length = await db.getCountOfTable('Genres');
  const _links = getLinks('genres', length, offset, limit);
  res.json({
    offset: offset,
    limit: limit,
    genres,
    _links
  });
});

router.post('/', 
requireAdminAuthentication,
async (req, res) => {
  const {
    name,
  } = sanitize(req.body);
  const q = 'INSERT INTO Genres(name) VALUES ($1) RETURNING *;';
  const result = await db.query(q, [name]);
  if (!result) {
    res.status(400).json({ err: 'Genre er nú þegar til' });
  }
  res.json(result.rows);
});