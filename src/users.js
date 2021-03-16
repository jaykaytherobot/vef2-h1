// users.js
import dotenv from 'dotenv';
import express from "express";
import * as db from './db.js';
import * as userDb from "./userdb.js";
import { body, validationResult } from "express-validator";
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

router.get('/:id[0-9]+',
  requireAdminAuthentication,
  async (req, res) => {
    // IF ADMIN RETURN USER WITH ID
    const { userId } = req.params;
    const data = await userDb.getUserByID(userId);
    if (data) return res.json({ data });
    return res.status(404).json({ msg: 'User not found' });
  });

router.post('/register',
  body('username')
    .trim()
    .isLength({ min: 1, max: 256 })
    .withMessage('username is required, max 256 characters')
    .not().custom(userDb.getUserByName)
    .withMessage('username already exists'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('email is required, max 256 characters')
    .normalizeEmail()
    .not().custom(userDb.getUserByEmail)
    .withMessage('email already exists'),
  body('password')
    .trim()
    .isLength({ min: 10, max: 256 })
    .withMessage('Password is required, min 10 characters, max 256 characters'),
  async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    const createdUser = await userDb.createUser({ name: username, email, password });

    if (createdUser) {
      return res.json({
        id: createdUser.id, 
        username: createdUser.name,
        email: createdUser.email, 
        admin: createdUser.admin,
        token: createTokenForUser(createdUser.id),
      });
    }

    return res.json({ error: 'Error registering' });
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
    return res.status(400).json({ "errors": errors });
  }

  const user = await getUserByName(username);

  if (!user) {
    return res.status(401).json({ error: 'No user with that email' });
  }

  const passwordIsCorrect = userDb.comparePasswords(password, user.password);

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

    if (!email && !name && !password) {
      res.status(400).json({ error: 'Nothing to update' });
    }

    if (email) {
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
