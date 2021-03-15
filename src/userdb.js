import { query } from './db.js';
import bcrypt from 'bcrypt';

export async function createUser(user, admin = false) {
  if (admin) {
    const q = 'INSERT INTO Users (name, email, password, admin) VALUES ($1, $2, $3, $4) RETURNING id, email';

    try {
      const result = await query(q, [user.name, user.email, await bcrypt.hash(user.password, 10), true]);
      if (result.rowCount === 1){
        return result.rows[0];
      }
    }
    catch (error) {
      console.error('Error creating user', error);
    }
  }

  const q = 'INSERT INTO Users (name, email, password) VALUES ($1, $2, $3) RETURNING id, email';

  try {
    const result = await query(q, [user.name, user.email, await bcrypt.hash(user.password, 10)]);
    if (result.rowCount === 1){
      return result.rows[0];
    }
  }
  catch (error) {
    console.error('Error creating user', error);
  }
  return false;
}

export async function getUserByName(name) {
  const q = 'SELECT * FROM Users WHERE name = $1;';
  console.log(name);
  try {
    const result = await query(q, [name]);
    console.log(result);

    if(result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Error occured :>> ', e);
    return null;
  }
  return false;
}

export async function getUserByEmail(email) {
  const q = 'SELECT * FROM Users WHERE email = $1;';
  console.log(email);
  try {
    const result = await query(q, [email]);
    console.log(result);

    if(result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Error occured :>> ', e);
    return null;
  }
  return false;
}

export async function getUserByID(id) {
  const q = 'SELECT * FROM Users WHERE id = $1;';
  try {
    const result = await query(q, [id]);
    if(result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Error occured :>> ', e);
    return null;
  }
  return false;
}

export async function comparePasswords(password, hash) {
  const result = await bcrypt.compare(password, hash);

  return result;
}