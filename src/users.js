// users.js
import dotenv from 'dotenv';
import express from "express";
import * as db from './db.js';
import * as userDb from "./userdb.js";
import bcrypt from 'bcrypt';
import passport from "passport";
import { createTokenForUser, requireAuthentication, requireAdminAuthentication } from "./login.js";

dotenv.config();

const {
  JWT_SECRET: jwtSecret,
  JWT_TOKENLIFETIME: jwtTokenlifetime = 20,
} = process.env;

export const router = express.Router();

router.get('/',
  requireAdminAuthentication,
  async (req, res) => {
    // IF ADMIN RETURN ALL USERS
    const data = await db.getAllFromTable('Users');
    if (data) return res.json({ data });
    return res.status(404).json({ msg: 'Table not found' });
  });

router.get('/:id',
  requireAdminAuthentication,
  async (req, res) => {
    // IF ADMIN RETURN USER WITH ID
    const { userId } = req.params;
    const data = await userDb.getUserByID(userId);
    if(data) return res.json({data});
    return res.status(404).json({ msg: 'User not found' });
  });

router.post('/register', async (req, res) => {
  // REGISTERS NON-ADMIN USER
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    const error = 'Missing username, email or password from body';
    return res.status(400).json({ error });
  }

  const createdUser = await userDb.createUser({ name: username, email, password });

  if (createdUser) {
    return res.json({
      email: createdUser.email,
      token: createTokenForUser(createdUser.id),
    });
  }

  return res.json({ error: 'Villa við skráningu' });
});

router.post('/login', async (req, res) => {
  // RETURNS TOKEN FOR EMAIL+PASSWORD COMBINATION
  const { username, password = '' } = req.body;

  const user = await db.getUserByName(username);

  if (!user) {
    return res.status(401).json({ error: 'No user with that username' });
  }

  // TODO check if passwords match
  const passwordIsCorrect = userDb.comparePasswords(password, user.password);

  if (passwordIsCorrect) {
    const token = createTokenForUser(user.id);
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
