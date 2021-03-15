// users.js
import dotenv from 'dotenv';
import express from "express";
import * as db from './db.js';
import bcrypt from 'bcrypt';
import passport from "passport";
import jwt from 'jsonwebtoken';
import { requireAuthentication } from "./login.js";

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

router.post('/register', (req, res) => {
  // REGISTERS NON-ADMIN USER
  res.json({
    msg: 'Not implemented',
    email: 'Not implemented',
    token: 'Not implemented',
  });
});

router.post('/login', async (req, res) => {
  // RETURNS TOKEN FOR EMAIL+PASSWORD COMBINATION
  const { username, password = '' } = req.body;

  const user = await db.getUserByName(username);

  if (!user) {
    return res.status(401).json({ error: 'No user with that username' });
  }

  // TODO check if passwords match
  const passwordIsCorrect = true;

  if (passwordIsCorrect) {
    const payload = { id: user.id };
    const tokenOptions = { expiresIn: jwtTokenlifetime };
    const token = jwt.sign(payload, jwtSecret, tokenOptions);
    return res.json({ token, msg: "Password check is not implemented" });
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
