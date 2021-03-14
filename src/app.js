import express from 'express';
import dotenv from 'dotenv';
import { router as tvRouter, getGenres, postGenres } from './tv.js';
import { router as userRouter } from './users.js';

dotenv.config();

const {
  PORT: port = 3000,
  SESSION_SECRET: sessionSecret,
} = process.env;

const app = express();

app.use('/tv', tvRouter);
app.get('/genres', getGenres);
app.post('/genres', getGenres);
app.use('/users', userRouter);

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
