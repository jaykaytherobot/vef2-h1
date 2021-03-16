// users.js
import dotenv from 'dotenv';
import express from "express";
import * as db from './db.js';
import * as userDb from "./userdb.js";
import { body, query, validationResult } from "express-validator";
import passport, { createTokenForUser, requireAuthentication, requireAdminAuthentication } from "./login.js";

dotenv.config();

const {
  JWT_SECRET: jwtSecret,
  JWT_TOKENLIFETIME: jwtTokenlifetime = 20,
} = process.env;

export const router = express.Router();

router.get('/',
  requireAdminAuthentication,
  query('offset')
    .if(query('offset').exists())
    .isInt()
    .withMessage('offset must be an integer')
    .bail()
    .custom(value => {
      return Number.parseInt(value) >= 0;
    })
    .withMessage('offset must be a positive integer'),
  query('limit')
    .if(query('limit').exists())
    .isInt()
    .withMessage('limit must be an integer')
    .bail()
    .custom(value => {
      return Number.parseInt(value) >= 0;
    })
    .withMessage('limit must be a positive integer'),
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()})
    }

    const {
      offset = 0, limit = 10
    } = req.query;

    const items = await db.getAllFromTable('Users', offset, limit);

    const next = items.length === limit ? { href: `http://localhost:3000/users?offset=${offset+limit}&limit=${limit}`}: undefined;
    const prev = offset > 0 ? { href: `http://localhost:3000/users?offset=${Math.max(offset-limit, 0)}&limit=${limit}`}: undefined;

    if (items) {
      return res.json({ 
        limit,
        offset,
        items,
        _links: {
          self: {
            href: `http://localhost:3000/users?offset=${offset}&limit=${limit}`
          },
          next,
          prev
        }
       });
    }
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
    .custom((value) => {
      return userDb.getUserByName(value).then(user => {
        if(user) {
          return Promise.reject('username already exists');
        }
      });
    }),
  body('email')
    .trim()
    .isEmail()
    .withMessage('email is required, max 256 characters')
    .normalizeEmail()
    .custom((value) => {
      return userDb.getUserByEmail(value).then(user => {
        if (user) {
          return Promise.reject('email already exists');
        }
      });
    }),
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

router.post('/login', 
  body('username')
    .trim()
    .isLength({ min: 1, max: 256 })
    .withMessage('username is required, max 256 characters'),
  body('password')
    .trim()
    .isLength({ min: 10, max: 256 })
    .withMessage('password is required, min 10 characters, max 256 characters'),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const user = await userDb.getUserByName(username);

    if (!user) {
      return res.status(401).json({ errors: [{
        value: username,
        msg: "username or password incorrect",
        param: 'username', 
        location: 'body'
      }]});
    }

    const passwordIsCorrect = userDb.comparePasswords(password, user.password);

    if (passwordIsCorrect) {
      const token = createTokenForUser(user.id);
      return res.json({
        "user": {
          id: user.id,
          username: user.name,
          email: user.email,
          admin: user.admin
        },
        token,
        expiresIn: "not implemented",
      });
    }

    return res.status(401).json({ errors: [{
      value: username,
      msg: "username or password incorrect",
      param: 'username', 
      location: 'body'
    }]});
});

router.get('/me',
  requireAuthentication,
  (req, res) => {
    res.json({
      id: req.user.id,
      username: req.user.name,
      email: req.user.email,
      admin: req.user.admin,
    });
  });


router.patch('/me', requireAuthentication,
  body('password')
    .if(body('password').exists())
    .isLength({ min: 10, max: 256 })
    .withMessage('password must be from 1 to 256 characters long'),
  body('email')
    .if(body('email').exists())
    .isEmail()
    .withMessage('email must be an email, example@example.com')
    .normalizeEmail()
    .custom((value) => {
      return userDb.getUserByEmail(value).then(user => {
        if (user) {
          return Promise.reject('email already exists');
        }
      });
    }),
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    if(!email && !password) {
      return res.status(400).json({
        errors: [{
          value: req.body,
          msg: 'require at least one of: email, password',
          param: '',
          location:'body'
        }]
      })
    }

    req.user.email = email ? email : req.user.email;
    req.user.password = password ? password : req.user.password;

    const user = await userDb.updateUser(req.user);
    
    res.json({
      id: user.id,
      username: user.name,
      email: user.email,
      admin: user.admin,
    });
  });
