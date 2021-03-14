import pg from 'pg';
import fs from 'fs';
import { readFile } from 'fs/promises';
import dotenv from 'dotenv';
import csv from 'csv-parser';

import { createNewSeries, query, createNewSeason } from './db.js';
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

// Notum SSL tengingu við gagnagrunn ef við erum *ekki* í development mode, þ.e.a.s. á local vél
const ssl = nodeEnv !== 'development' ? { rejectUnauthorized: false } : false;

const pool = new pg.Pool({ connectionString, ssl });

async function setup() {
  // TODO   1. búa til user töflu
  //        2. búa til 1 admin og 1 almennan notenda
  //        3. Búa til þátta töflu
  //        4. Lesa úr .csv skrám til að populate-a

  // Býr til töflur
  const createTable = await readFile('./sql/schema.sql');
  const tData = createTable.toString('utf-8');
  const result = await query(tData);

  const SERIES = [];
  const GENRES = [];
  const SEASONS = [];
  const EPISODES = [];
  
  fs.createReadStream('./data/series.csv')
    .pipe(csv())
    .on('data', async (serie) => { 
      await createNewSeries(serie);
    })
    .on('end', () => {
      console.log("Finished reading series.csv");
    });

  fs.createReadStream('./data/seasons.csv')
    .pipe(csv())
    .on('data', async (season) => {
      await createNewSeason(season);
    })
    .on('end', () => {
      console.info('Finished reading seasons.csv');
    });

}

await setup();