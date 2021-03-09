import pg from 'pg';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';

import { query } from './db.js';
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
  const createTable = await readFile('./sql/schema.sql');
  const tData = createTable.toString('utf-8');
  const result = await query(tData);
  let Seasons = ''
  try {
    Seasons = await readFile('./data/series.csv');
  } finally {
    console.log(Seasons);
  }
  
  
}

await setup();