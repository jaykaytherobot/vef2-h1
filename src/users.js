import express from 'express';
import * as db from './db.js';

export const router = express.Router();

router.get('/', async (_req, res) => {
    const result = await db.getAllFromTable('Users');
    if (result.length!==0) return res.json(result);
    else return res.status(400).json({ msg: 'Table not found' });
});

router.get('/:userId', (req, res) => {
    res.json({ foo: 'bar' });
});

router.patch('/:userId', (req, res) => {
    res.json({ foo: 'bar' });
});

router.post('/register', (req, res) => {
    res.json({ foo: 'bar' });
});

router.get('/me', (req, res) => {
    res.json({ foo: 'bar' });
});

router.patch('/me', (req, res) => {
    res.json({ foo: 'bar' });
});

