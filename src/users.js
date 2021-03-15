// users.js
import dotenv from 'dotenv';
import express from "express";
import * as db from './db.js';
import { comparePasswords, createUser, getUserByEmail, getUserByName } from "./userdb.js";
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

router.get('/:id[0-9]+', (req, res) => {
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
  const { username, password = '' } = req.body;
  
  const errors = [];
  if (!username) {
    errors.push({
      msg: "username is required, max 256 characters",
      param: "username",
      location: "body",
    });
  }
  if (!password) {
    errors.push({
      msg: "password is required, max 256 characters",
      param: "password",
      location: "body",
    });
  }
  if (errors.length > 0) {
    return res.status(400).json( { "errors": errors } );
  }

  const user = await getUserByName(username);

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

router.get('/me', 
  requireAuthentication,  
  (req, res) => {
    // IF AUTHENTICATED RETURN EMAIL AND PASSWORD
    res.json({
      email: req.user.email,
      username: req.user.name,
    });
});


router.patch('/me', requireAuthentication,
  (req, res) => {
    const { email, name, password } = req.body;

    if(!email && !name && !password) {
      res.status(400).json({ error: 'Nothing to update' });
    }

    if(email) {
      // update email
    }

    if (name) {
      // update name
    }

    if (password) {
      //update password
    }
    res.json({
      msg: 'Not implemented',
      email: 'Not implemented',
      username: 'Not implemented',
    });
});
