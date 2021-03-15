// users.js
import dotenv from 'dotenv';
import express from "express";
import * as db from './db.js';
import { comparePasswords, createUser, getUserByEmail } from "./userdb.js";
import bcrypt from 'bcrypt';
import passport from "passport";
import { createTokenForUser, requireAuthentication } from "./login.js";

dotenv.config();

const {
  JWT_SECRET: jwtSecret,
  JWT_TOKENLIFETIME: jwtTokenlifetime = 20,
} = process.env;

export const router = express.Router();

router.get('/',
  requireAuthentication,
  (req, res) => {
    // IF ADMIN RETURN ALL USERS
    res.json({
      msg: 'Not implemented',
    });
  });

router.get('/:id', (req, res) => {
  // IF ADMIN RETURN USER WITH ID
  res.json({
    msg: 'Not implemented',
  });
});

router.post('/register', async (req, res) => {
  // REGISTERS NON-ADMIN USER
  const { username, email, password } = req.body;

  if(!username || !email || !password) {
    const error = 'Missing username, email or password from body';
    return res.status(400).json({ error });
  }

  const createdUser = await createUser({ name: username, email, password });

  if(createdUser) {
    return res.json({
      email: createdUser.email,
      token: createTokenForUser(createdUser.id),
    });
  }
  
  return res.json({ error: 'Villa við skráningu' });
});

router.post('/login', async (req, res) => {
  // RETURNS TOKEN FOR EMAIL+PASSWORD COMBINATION
  const { email, password = '' } = req.body;

  const user = await getUserByEmail(email);

  if (!user) {
    return res.status(401).json({ error: 'No user with that email' });
  }

  const passwordIsCorrect = comparePasswords(password, user.password);

  if (passwordIsCorrect) {
    const token = createTokenForUser(user.id);
    return res.json({ token });
  }

  return res.status(401).json({ error: 'Invalid password' });
});

router.get('/logout', (req, res) => {
  // do something to log user out
  res.redirect('/');
});

router.get('/me', (req, res) => {
  // IF AUTHENTICATED RETURN EMAIL AND PASSWORD
  res.json({
    msg: 'Not implemented',
    email: 'Not implemented',
    username: 'Not implemented',
  });
});


router.patch('/me', (req, res) => {
  // IF AUTHENTICATED UPDATE INFO
  res.json({
    msg: 'Not implemented',
    email: 'Not implemented',
    username: 'Not implemented',
  });
});
