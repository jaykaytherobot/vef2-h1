import express from 'express';
import dotenv from 'dotenv';
import { router as tvRouter, getGenres, postGenres } from './tv.js';
import { router as userRouter } from './users.js';
import passport, { requireAdminAuthentication } from './login.js';

dotenv.config();

const {
  PORT: port = 3000,
  SESSION_SECRET: sessionSecret,
} = process.env;

const app = express();

// þetta býr til req.body hlut
app.use(express.json());

app.use(passport.initialize());

app.get('/', (req, res) => {
  res.json({
    "tv": {
        "series": {
            "href": "/tv",
            "methods": [
                "GET",
                "POST"
            ]
        },
        "serie": {
            "href": "/tv/{id}",
            "methods": [
                "GET",
                "PATCH",
                "DELETE"
            ]
        },
        "rate": {
            "href": "/tv/{id}/rate",
            "methods": [
                "POST",
                "PATCH",
                "DELETE"
            ]
        },
        "state": {
            "href": "/tv/{id}/state",
            "methods": [
                "POST",
                "PATCH",
                "DELETE"
            ]
        }
    },
    "seasons": {
        "seasons": {
            "href": "/tv/{id}/season",
            "methods": [
                "GET",
                "POST"
            ]
        },
        "season": {
            "href": "/tv/{id}/season/{season}",
            "methods": [
                "GET",
                "DELETE"
            ]
        }
    },
    "episodes": {
        "episodes": {
            "href": "/tv/{id}/season/{season}/episode",
            "methods": [
                "POST"
            ]
        },
        "episode": {
            "href": "/tv/{id}/season/{season}/episode/{episode}",
            "methods": [
                "GET",
                "DELETE"
            ]
        }
    },
    "genres": {
        "genres": {
            "href": "/genres",
            "methods": [
                "GET",
                "POST"
            ]
        }
    },
    "users": {
        "users": {
            "href": "/users",
            "methods": [
                "GET"
            ]
        },
        "user": {
            "href": "/users/{id}",
            "methods": [
                "GET",
                "PATCH"
            ]
        },
        "register": {
            "href": "/users/register",
            "methods": [
                "POST"
            ]
        },
        "login": {
            "href": "/users/login",
            "methods": [
                "POST"
            ]
        },
        "me": {
            "href": "/users/me",
            "methods": [
                "GET",
                "PATCH"
            ]
        }
    }
});
});

app.use('/users', userRouter);
app.use('/tv', tvRouter);
app.get('/genres', getGenres);
app.post('/genres', requireAdminAuthentication, postGenres);
app.use('/users', userRouter);

function notFoundHandler(req, res, next) { // eslint-disable-line
  res.status(404).json({ error: 'Not found' });
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid json' });
  }

  return res.status(500).json({ error: 'Internal server error' });
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
