import pg from 'pg';
import fs from 'fs';
import { readFile } from 'fs/promises';
import dotenv from 'dotenv';
import csv from 'csv-parser';

import {
  createNewSerie,
  query,
  createNewSeason,
  createNewEpisode,
  initializeSeriesSequence,
} from './db.js';

import { createUser } from './userdb.js';

dotenv.config();

const {
  DATABASE_URL: connectionString,
  NODE_ENV: nodeEnv = '',
} = process.env;

console.info('process.env :>> ', process.env.DATABASE_URL);

if (!connectionString) {
  console.error('Vantar DATABASE_URL!');
  process.exit(1);
}

async function createTables() {
  const createTable = await readFile('./sql/schema.sql');
  const tData = createTable.toString('utf-8');
  await query(tData);
  return;
}

async function setupSeries() {
  fs.createReadStream('./data/series.csv')
    .pipe(csv())
    .on('data', async (serie) => {
      await createNewSerie(serie);
    })
    .on('end', async () => {
      await initializeSeriesSequence();
      console.info('Finished reading series.csv');
      setTimeout(async () => await setupSeasons(), 2000);
    });
    return;
}

async function setupSeasons() {
  fs.createReadStream('./data/seasons.csv')
    .pipe(csv())
    .on('data', async (season) => {
      await createNewSeason(season);
    })
    .on('end', async () => {
      console.info('Finished reading seasons.csv');
      setTimeout(async () => await setupEpisodes(), 2000);
    });
    return;
}

async function setupEpisodes() {
  fs.createReadStream('./data/episodes.csv')
    .pipe(csv())
    .on('data', async (episode) => {
      await createNewEpisode(episode);
    })
    .on('end', async () => {
      console.info('Finished reading episodes.csv');
    });
    return;
}

async function setup() {
  await createTables();
  await setupSeries();
  createUser({
    name: 'admin',
    email: 'admin@admin.com',
    password: '0123456789',
  },
  true);

  createUser({
    name: 'notAdmin',
    email: 'example@example.com',
    password: '0123456789',
  });
}

setup();
