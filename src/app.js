import express from 'express';
import dotenv from 'dotenv';
import { router as tvRouter } from './tv.js';

dotenv.config();

const {
  PORT: port = 3000,
  SESSION_SECRET: sessionSecret,
} = process.env;

const app = express();

app.use('/tv', tvRouter);

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
